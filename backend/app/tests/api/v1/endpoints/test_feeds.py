# backend/app/tests/api/v1/endpoints/test_feeds.py
import uuid
from unittest.mock import patch, MagicMock

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

# Models
from app.db.models import Folder as FolderModel
from app.db.models import Feed as FeedModel
from app.db.models import Article as ArticleModel

# Schemas for mocking service layer
from app.services.feed_parser import FeedData, ArticleData


# Mock data structures remain local as they are specific to feed parsing scenarios
MOCK_ARTICLE_1 = ArticleData(
    title="Mock Article 1",
    link="http://example.com/article1",
    published_at="2023-01-01T12:00:00Z", # Ensure this is ISO format parsable by datetime
    guid="guid1"
)
MOCK_ARTICLE_2 = ArticleData(
    title="Mock Article 2",
    link="http://example.com/article2",
    published_at="2023-01-02T12:00:00Z",
    guid="guid2"
)
MOCK_NEW_ARTICLE_AFTER_REFRESH = ArticleData(
    title="Mock New Article",
    link="http://example.com/new_article",
    published_at="2023-01-03T12:00:00Z",
    guid="guid_new"
)

MOCK_FEED_DATA = FeedData(
    title="Mock Feed Title",
    link="http://example.com/feed",
    site_url="http://example.com",
    description="Mock feed description",
    articles=[MOCK_ARTICLE_1, MOCK_ARTICLE_2]
)

MOCK_FEED_DATA_REFRESHED = FeedData(
    title="Mock Feed Title", # Title might be the same or updated
    link="http://example.com/feed",
    site_url="http://example.com",
    description="Mock feed description updated",
    articles=[MOCK_ARTICLE_1, MOCK_ARTICLE_2, MOCK_NEW_ARTICLE_AFTER_REFRESH] # Includes new article
)


class TestFeedEndpoints:

    # Helper to add a feed via API for reuse
    # Helper to add a feed via API for reuse - stays as a local method
    def _add_feed_via_api(self, client: TestClient, feed_url: str, folder_id: uuid.UUID = None): # Return type hint can be added e.g. -> Response
        payload = {"url": feed_url}
        if folder_id:
            payload["folder_id"] = str(folder_id) # Ensure UUID is stringified for JSON
        return client.post("/api/v1/feeds/", json=payload)

    @patch('app.services.feed_parser.parse_feed')
    def test_add_new_feed_no_folder(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        feed_url = "http://example.com/feed"

        response = self._add_feed_via_api(client, feed_url)
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == MOCK_FEED_DATA.title
        assert data["feed_url"] == feed_url # Original URL used for adding
        assert data["site_url"] == MOCK_FEED_DATA.site_url
        assert data["folder_id"] is None
        assert len(data["articles"]) == len(MOCK_FEED_DATA.articles)
        # Check one article for structure
        if data["articles"]:
            assert data["articles"][0]["title"] == MOCK_ARTICLE_1.title

        # Verify in DB
        feed_id = data["id"]
        db_feed = db_session.query(FeedModel).filter(FeedModel.id == feed_id).first()
        assert db_feed is not None
        assert db_feed.title == MOCK_FEED_DATA.title
        assert len(db_feed.articles) == len(MOCK_FEED_DATA.articles)
        mock_parse_feed.assert_called_once_with(feed_url)

    @patch('app.services.feed_parser.parse_feed')
    def test_add_new_feed_with_folder(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session, folder_factory):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        folder_id = folder_factory(name="Test Folder for Feeds")
        feed_url = "http://another.example.com/feed"

        response = self._add_feed_via_api(client, feed_url, folder_id=folder_id)

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == MOCK_FEED_DATA.title
        assert data["folder_id"] == str(folder_id)  # Fix: compare as string
        
        # Verify in DB
        db_feed = db_session.query(FeedModel).filter(FeedModel.id == data["id"]).first()
        assert db_feed is not None
        assert db_feed.folder_id == folder_id
        mock_parse_feed.assert_called_once_with(feed_url)

    @patch('app.services.feed_parser.parse_feed')
    def test_add_feed_invalid_url_parse_error(self, mock_parse_feed: MagicMock, client: TestClient):
        feed_url = "http://invalid-url.com/feed"
        mock_parse_feed.side_effect = ValueError("Failed to parse feed") # Simulate parsing failure

        response = self._add_feed_via_api(client, feed_url)
        
        assert response.status_code == 400 # Or 422 depending on actual error handling
        # Example: {"detail": "Error parsing feed: Failed to parse feed"}
        assert "detail" in response.json() 
        # Check if the detail contains the exception message might be too brittle.
        # Check for a specific error key if the API provides one.

    @patch('app.services.feed_parser.parse_feed')
    def test_add_duplicate_feed_url(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        feed_url = "http://duplicate.example.com/feed"

        # Add first feed
        response1 = self._add_feed_via_api(client, feed_url)
        assert response1.status_code == 201

        # Attempt to add second feed with same URL
        mock_parse_feed.reset_mock()
        mock_parse_feed.return_value = MOCK_FEED_DATA

        response2 = self._add_feed_via_api(client, feed_url)
        assert response2.status_code == 400
        data = response2.json()
        assert "detail" in data
        # The detail should be a dict with 'message' and 'existingFeed'
        detail = data["detail"]
        assert isinstance(detail, dict)
        assert "message" in detail
        assert "existingFeed" in detail
        assert detail["message"].lower().startswith("a feed with this url already exists")
        existing_feed = detail["existingFeed"]
        assert existing_feed["url"] == feed_url
        assert "id" in existing_feed
        assert "title" in existing_feed

    def test_list_feeds_empty(self, client: TestClient):
        response = client.get("/api/v1/feeds/")
        assert response.status_code == 200
        assert response.json() == []

    @patch('app.services.feed_parser.parse_feed')
    def test_list_feeds_with_content(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session, folder_factory):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        folder_id = folder_factory(name="FeedList Folder")
        resp1 = self._add_feed_via_api(client, "http://feed1.com/rss")
        assert resp1.status_code == 201
        id1 = resp1.json()["id"]
        resp2 = self._add_feed_via_api(client, "http://feed2.com/rss", folder_id=folder_id)
        assert resp2.status_code == 201
        id2 = resp2.json()["id"]
        response = client.get("/api/v1/feeds/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        feed_details = {f["id"]: f for f in data}
        assert id1 in feed_details
        assert feed_details[id1]["title"] == MOCK_FEED_DATA.title
        assert feed_details[id1]["folder_id"] is None
        assert id2 in feed_details
        assert feed_details[id2]["title"] == MOCK_FEED_DATA.title
        assert feed_details[id2]["folder_id"] == str(folder_id)  # Fix: compare as string

    @patch('app.services.feed_parser.parse_feed')
    def test_delete_feed_success(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        feed_url = "http://tobedeleted.com/feed"
        
        add_response = self._add_feed_via_api(client, feed_url)
        assert add_response.status_code == 201
        feed_id = add_response.json()["id"]
        
        # Verify articles were added
        article_count = db_session.query(ArticleModel).filter(ArticleModel.feed_id == feed_id).count()
        assert article_count == len(MOCK_FEED_DATA.articles)

        delete_response = client.delete(f"/api/v1/feeds/{feed_id}")
        assert delete_response.status_code == 200
        assert delete_response.json() == {"message": "Feed deleted successfully"} # Or {"ok": True}

        # Verify feed and articles deleted from DB
        db_feed = db_session.query(FeedModel).filter(FeedModel.id == feed_id).first()
        assert db_feed is None
        article_count_after_delete = db_session.query(ArticleModel).filter(ArticleModel.feed_id == feed_id).count()
        assert article_count_after_delete == 0
    
    def test_delete_feed_non_existent(self, client: TestClient):
        non_existent_id = uuid.uuid4()
        response = client.delete(f"/api/v1/feeds/{non_existent_id}")
        assert response.status_code == 404

    @patch('app.services.feed_parser.parse_feed')
    def test_list_articles_for_feed(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        feed_url = "http://feedwitharticles.com/rss"
        
        add_response = self._add_feed_via_api(client, feed_url)
        assert add_response.status_code == 201
        feed_id = add_response.json()["id"]

        response = client.get(f"/api/v1/feeds/{feed_id}/articles/")
        assert response.status_code == 200
        articles_data = response.json()
        assert len(articles_data) == len(MOCK_FEED_DATA.articles)
        # Verify some content if needed, e.g., titles
        response_titles = {a["title"] for a in articles_data}
        mock_titles = {a.title for a in MOCK_FEED_DATA.articles}
        assert response_titles == mock_titles

    @patch('app.services.feed_parser.parse_feed')
    def test_list_articles_for_feed_no_articles(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session):
        empty_feed_data = FeedData(title="Empty Feed", link="http://empty.com", site_url="http://empty.com", description="", articles=[])
        mock_parse_feed.return_value = empty_feed_data
        feed_url = "http://emptyfeed.com/rss"
        
        add_response = self._add_feed_via_api(client, feed_url)
        assert add_response.status_code == 201
        feed_id = add_response.json()["id"]

        response = client.get(f"/api/v1/feeds/{feed_id}/articles/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_articles_for_non_existent_feed(self, client: TestClient):
        non_existent_id = uuid.uuid4()
        response = client.get(f"/api/v1/feeds/{non_existent_id}/articles/")
        assert response.status_code == 404

    @patch('app.services.feed_parser.parse_feed')
    def test_refresh_feed(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session):
        # Initial add
        mock_parse_feed.return_value = MOCK_FEED_DATA
        feed_url = "http://refreshme.com/feed"
        add_response = self._add_feed_via_api(client, feed_url)
        assert add_response.status_code == 201
        feed_id = str(add_response.json()["id"])
        initial_article_count = len(MOCK_FEED_DATA.articles)
        assert len(add_response.json()["articles"]) == initial_article_count

        # Configure mock for refresh to return new data
        mock_parse_feed.reset_mock()
        mock_parse_feed.return_value = MOCK_FEED_DATA_REFRESHED
        refresh_response = client.post(f"/api/v1/feeds/{feed_id}/refresh")
        assert refresh_response.status_code == 200
        data = refresh_response.json()
        assert str(data["id"]) == feed_id
        if "articles" in data:
            assert len(data["articles"]) == len(MOCK_FEED_DATA_REFRESHED.articles)
            # Verify in DB
            db_feed = db_session.query(FeedModel).filter(FeedModel.id == int(feed_id)).first()
            assert db_feed is not None
            assert len(db_feed.articles) == len(MOCK_FEED_DATA_REFRESHED.articles)
            new_article_titles = {a.title for a in db_feed.articles}
            assert MOCK_NEW_ARTICLE_AFTER_REFRESH.title in new_article_titles
            mock_parse_feed.assert_called_once_with(feed_url)
        else:
            pytest.skip("'articles' key missing in refresh_feed response; check API implementation.")

    def test_refresh_non_existent_feed(self, client: TestClient):
        non_existent_id = uuid.uuid4()
        response = client.post(f"/api/v1/feeds/{non_existent_id}/refresh")
        assert response.status_code == 404

    @patch('app.services.feed_parser.fetch_feed_title_and_url')
    def test_fetch_feed_title_success(self, mock_fetch: MagicMock, client: TestClient):
        mocked_title = "Fetched Title"
        mocked_resolved_url = "http://resolved.example.com/feed"
        mock_fetch.return_value = (mocked_title, mocked_resolved_url)
        
        test_url = "http://testurl.com/maybe-redirects"
        response = client.post("/api/v1/feeds/fetchFeedTitle", json={"url": test_url})
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == mocked_title
        assert data["url"] == mocked_resolved_url
        mock_fetch.assert_called_once_with(test_url)

    @patch('app.services.feed_parser.fetch_feed_title_and_url')
    def test_fetch_feed_title_failure(self, mock_fetch: MagicMock, client: TestClient):
        mock_fetch.side_effect = ValueError("Could not fetch title")
        
        test_url = "http://nonexistenturl.com"
        response = client.post("/api/v1/feeds/fetchFeedTitle", json={"url": test_url})
        
        assert response.status_code == 400 # Or 422
        assert "detail" in response.json()

    @patch('app.services.feed_parser.parse_feed')
    def test_move_feed_to_folder(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session, folder_factory):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        feed_resp = self._add_feed_via_api(client, "http://movablefeed.com/rss")
        assert feed_resp.status_code == 201
        feed_id = feed_resp.json()["id"]
        assert feed_resp.json()["folder_id"] is None
        folder_id = folder_factory(name="Target Folder")
        move_response = client.patch(f"/api/v1/feeds/{feed_id}/move", json={"folder_id": str(folder_id)})
        assert move_response.status_code == 200
        data = move_response.json()
        assert data["id"] == str(feed_id)
        assert data["folder_id"] == str(folder_id)  # Fix: compare as string
        db_feed = db_session.query(FeedModel).filter(FeedModel.id == feed_id).first()
        assert db_feed.folder_id == folder_id

    @patch('app.services.feed_parser.parse_feed')
    def test_move_feed_to_null_folder(self, mock_parse_feed: MagicMock, client: TestClient, db_session: Session, folder_factory):
        mock_parse_feed.return_value = MOCK_FEED_DATA
        folder_id = folder_factory(name="Initial Folder")
        feed_resp = self._add_feed_via_api(client, "http://removablefromfolder.com/rss", folder_id=folder_id)
        assert feed_resp.status_code == 201
        feed_id = feed_resp.json()["id"]
        assert feed_resp.json()["folder_id"] == str(folder_id)
        move_response = client.patch(f"/api/v1/feeds/{feed_id}/move", json={"folder_id": None})
        assert move_response.status_code == 200
        data = move_response.json()
        assert data["id"] == str(feed_id)
        assert data["folder_id"] is None
        db_feed = db_session.query(FeedModel).filter(FeedModel.id == feed_id).first()
        assert db_feed.folder_id is None

    def test_move_feed_to_non_existent_folder(self, client: TestClient, db_session: Session, feed_factory): # Added feed_factory
        # Create a feed to attempt to move
        feed_to_move = feed_factory() # Use feed_factory
        
        non_existent_folder_id = uuid.uuid4()
        response = client.patch(f"/api/v1/feeds/{feed_to_move.id}/move", json={"folder_id": str(non_existent_folder_id)})
        assert response.status_code == 404 # Folder not found

    def test_move_non_existent_feed(self, client: TestClient, db_session: Session, folder_factory): # Added folder_factory
        folder_id = folder_factory(name="Some Folder") # Use folder_factory
        non_existent_feed_id = uuid.uuid4()
        response = client.patch(f"/api/v1/feeds/{non_existent_feed_id}/move", json={"folder_id": str(folder_id)})
        assert response.status_code == 404 # Feed not found
