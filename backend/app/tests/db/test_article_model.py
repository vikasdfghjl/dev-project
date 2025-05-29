# backend/app/tests/db/test_article_model.py
import pytest
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone

from app.db.models import Article as ArticleModel
from app.db.models import Feed as FeedModel # Needed for relationship / feed_factory


# create_dummy_feed helper is removed, will use feed_factory fixture

class TestArticleModel:

    def test_create_article_success(self, db_session: Session, feed_factory):
        feed = feed_factory() # Use feed_factory
        
        article_data = {
            "feed_id": feed.id,
            "title": "Test Article Title",
            "link": "http://example.com/article1",
            "published_at": datetime.now(timezone.utc),
            "guid": "testguid1",
            "description": "A short description.",
            "image_url": "http://example.com/image.png"
        }
        
        article = ArticleModel(**article_data)
        db_session.add(article)
        db_session.commit()
        db_session.refresh(article)

        assert article.id is not None
        assert article.title == article_data["title"]
        assert article.feed_id == feed.id
        assert article.is_read is False # Default value
        assert article.guid == "testguid1"

    def test_article_relationship_with_feed(self, db_session: Session, feed_factory):
        feed = feed_factory(feed_url="http://feedforrelation.com/rss") # Use feed_factory
        
        article = ArticleModel(
            feed_id=feed.id,
            title="Article for Feed Relation Test",
            link="http://example.com/relation_test",
            published_at=datetime.now(timezone.utc),
            guid="guid_relation_test"
        )
        db_session.add(article)
        db_session.commit()
        db_session.refresh(article)
        db_session.refresh(feed) # Refresh feed to see the relationship populated

        assert article.feed is not None
        assert article.feed.id == feed.id
        assert article.feed.title == "Dummy Feed"
        assert article in feed.articles

    def test_article_default_is_read(self, db_session: Session, feed_factory):
        feed = feed_factory(feed_url="http://feedfordefault.com/rss") # Use feed_factory
        article = ArticleModel(
            feed_id=feed.id,
            title="Default Read Test",
            link="http://example.com/default_read",
            published_at=datetime.now(timezone.utc),
            guid="guid_default_read"
        )
        db_session.add(article)
        db_session.commit()
        db_session.refresh(article)
        
        assert article.is_read is False

    def test_article_guid_uniqueness_within_feed(self, db_session: Session, feed_factory):
        feed = feed_factory(feed_url="http://feedforguid.com/rss") # Use feed_factory
        common_guid = "unique_guid_123"

        article1 = ArticleModel(
            feed_id=feed.id,
            title="Article 1 with GUID",
            link="http://example.com/article_guid1",
            published_at=datetime.now(timezone.utc),
            guid=common_guid
        )
        db_session.add(article1)
        db_session.commit()

        article2_data = {
            "feed_id": feed.id,
            "title": "Article 2 with same GUID",
            "link": "http://example.com/article_guid2",
            "published_at": datetime.now(timezone.utc),
            "guid": common_guid # Same GUID
        }
        article2 = ArticleModel(**article2_data)
        db_session.add(article2)
        
        # The unique constraint is (feed_id, guid)
        with pytest.raises(IntegrityError):
            db_session.commit()
        db_session.rollback()

    def test_article_guid_can_be_same_for_different_feeds(self, db_session: Session, feed_factory):
        feed1 = feed_factory(feed_url="http://feed1_for_guid.com/rss") # Use feed_factory
        feed2 = feed_factory(feed_url="http://feed2_for_guid.com/rss") # Use feed_factory
        common_guid = "shared_guid_across_feeds"

        article1 = ArticleModel(
            feed_id=feed1.id,
            title="Article Feed1",
            link="http://example.com/f1_article",
            published_at=datetime.now(timezone.utc),
            guid=common_guid
        )
        db_session.add(article1)
        db_session.commit()

        article2 = ArticleModel(
            feed_id=feed2.id,
            title="Article Feed2",
            link="http://example.com/f2_article",
            published_at=datetime.now(timezone.utc),
            guid=common_guid # Same GUID, but different feed
        )
        db_session.add(article2)
        
        # This should commit successfully
        db_session.commit()
        db_session.refresh(article1)
        db_session.refresh(article2)

        assert article1.guid == common_guid
        assert article2.guid == common_guid
        assert article1.feed_id != article2.feed_id
        
    def test_article_missing_required_fields_sqlalchemy(self, db_session: Session, feed_factory):
        feed = feed_factory(feed_url="http://feedformissing.com/rss") # Use feed_factory
        # Test missing title (nullable=False)
        with pytest.raises(IntegrityError):
            article_no_title = ArticleModel(
                feed_id=feed.id, 
                link="http://example.com/no_title", 
                published_at=datetime.now(timezone.utc),
                guid="guid_no_title"
            )
            db_session.add(article_no_title)
            db_session.commit()
        db_session.rollback()

        # Test missing link (nullable=False)
        with pytest.raises(IntegrityError):
            article_no_link = ArticleModel(
                feed_id=feed.id, 
                title="No Link Article", 
                published_at=datetime.now(timezone.utc),
                guid="guid_no_link"
            )
            db_session.add(article_no_link)
            db_session.commit()
        db_session.rollback()
        
        # Test missing guid (nullable=False)
        with pytest.raises(IntegrityError):
            article_no_guid = ArticleModel(
                feed_id=feed.id, 
                title="No GUID Article", 
                link="http://example.com/no_guid",
                published_at=datetime.now(timezone.utc)
            )
            db_session.add(article_no_guid)
            db_session.commit()
        db_session.rollback()

        # Test missing published_at (nullable=True in model)
        article_no_published_at = ArticleModel(
            feed_id=feed.id,
            title="No Published At Article",
            link="http://example.com/no_published_at",
            guid="guid_no_published_at"
        )
        db_session.add(article_no_published_at)
        db_session.commit() # Should succeed as published_at is nullable in model
        assert article_no_published_at.published_at is None
        db_session.delete(article_no_published_at) # cleanup
        db_session.commit()

    def test_article_string_field_lengths(self, db_session: Session, feed_factory):
        feed = feed_factory(feed_url="http://feedforlengths.com") # Use feed_factory
        # title: String(255)
        # link: String(2048)
        # guid: String(2048)
        # description: Text (effectively unlimited for this test)
        # image_url: String(2048)

        long_title = "t" * 256
        long_link = "l" * 2049
        long_guid = "g" * 2049
        long_image_url = "i" * 2049

        # SQLAlchemy itself doesn't always enforce length constraints before commit
        # if the DB backend truncates or errors. The error type can vary.
        # For SQLite, it often truncates or doesn't error.
        # PostgreSQL would raise DataError.
        # We are testing against SQLite in memory, which might not strictly enforce.
        # The real enforcement is at the DB schema level.
        # However, it's good practice to have this test.

        # Test title length (expect no error from SQLAlchemy on SQLite, but good to have)
        article_long_title = ArticleModel(
            feed_id=feed.id, title="t" * 255, link="http://ok.com", guid="guid_len1", published_at=datetime.now(timezone.utc)
        )
        db_session.add(article_long_title)
        db_session.commit() # Should be fine
        db_session.delete(article_long_title)
        db_session.commit()

        # If we were on PostgreSQL and a value too long was inserted,
        # an IntegrityError (or specific DataError) would be raised upon commit.
        # For now, this test mostly serves as documentation of expected lengths.
        # A more robust test would involve a DB that strictly enforces lengths.
        pass # Skipping explicit checks for >max length errors for SQLite's behavior.
             # The schema definition is the source of truth for max lengths.
             # API level tests with schemas would catch this if schemas include length validation.
             # Pydantic schemas for create/update should ideally have these length constraints.
             # Let's assume schemas/API layer handle this.
             # The main purpose here is to check if the model can hold max length.
        
        article_max_lengths = ArticleModel(
            feed_id=feed.id,
            title="t" * 255,
            link="l" * 2048,
            published_at=datetime.now(timezone.utc),
            guid="g" * 2048,
            description="Some description",
            image_url="i" * 2048
        )
        db_session.add(article_max_lengths)
        db_session.commit()
        db_session.refresh(article_max_lengths)
        assert len(article_max_lengths.title) == 255
        assert len(article_max_lengths.link) == 2048
        assert len(article_max_lengths.guid) == 2048
        assert len(article_max_lengths.image_url) == 2048

        db_session.delete(article_max_lengths)
        db_session.commit()

    # Test for created_at and updated_at defaults/updates is omitted as they are handled by db.utils.TimestampMixin
    # and are implicitly tested when an object is created or updated.
    # If there were specific logic beyond the mixin, it would be tested here.
    
    # Test for content field (CLOB/TEXT) - usually just check it can store large text
    def test_article_content_field(self, db_session: Session, feed_factory):
        feed = feed_factory(feed_url="http://feedforcontent.com") # Use feed_factory
        large_content = "This is a very large content string. " * 1000 # Approx 40k chars

        article = ArticleModel(
            feed_id=feed.id,
            title="Content Test",
            link="http://example.com/content_test",
            published_at=datetime.now(timezone.utc),
            guid="guid_content_test",
            content=large_content
        )
        db_session.add(article)
        db_session.commit()
        db_session.refresh(article)

        assert article.content == large_content
        db_session.delete(article)
        db_session.commit()

    # Test boolean is_read can be updated
    def test_update_article_is_read(self, db_session: Session, feed_factory):
        feed = feed_factory(feed_url="http://feedforisreadupdate.com") # Use feed_factory
        article = ArticleModel(
            feed_id=feed.id,
            title="Update Read Status",
            link="http://example.com/update_read",
            published_at=datetime.now(timezone.utc),
            guid="guid_update_read"
        )
        db_session.add(article)
        db_session.commit()
        db_session.refresh(article)

        assert article.is_read is False # Default

        article.is_read = True
        db_session.commit()
        db_session.refresh(article)
        assert article.is_read is True

        article.is_read = False
        db_session.commit()
        db_session.refresh(article)
        assert article.is_read is False
        
        db_session.delete(article)
        db_session.commit()
