# backend/app/tests/conftest.py
import sys
import os
# Always add the backend root (the directory containing 'app') to sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from typing import Callable # For type hinting factories
import uuid # For potential default UUIDs if needed

from app.main import app
from app.db.database import Base, get_db
# Import models that factories will create
from app.db.models import Folder as FolderModel, Feed as FeedModel 
from sqlalchemy.orm import Session, declarative_base


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def db_engine():
    Base.metadata.create_all(bind=engine)
    yield engine


@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]


@pytest.fixture
def folder_factory(db_session: Session) -> Callable[..., int]:
    """Fixture to create Folder models directly in the database and return the folder id."""
    def _create_folder(name: str = "Test Folder") -> int:
        folder = FolderModel(name=name)
        db_session.add(folder)
        db_session.commit()
        folder_id = folder.id  # Extract id before session closes
        return folder_id
    return _create_folder


@pytest.fixture
def feed_factory(db_session: Session) -> Callable[..., FeedModel]:
    """Fixture to create Feed models directly in the database."""
    def _create_feed(
        feed_url: str = f"http://testfeed.com/{uuid.uuid4()}.rss", # Ensure unique URL by default
        title: str = "Test Feed",
        site_url: str = None, # Optional: use feed_url's domain if None
        folder_id: uuid.UUID = None
    ) -> FeedModel:
        if site_url is None:
            # Basic site_url derivation from feed_url
            try:
                site_url = "/".join(feed_url.split("/")[:3])
            except Exception:
                site_url = "http://defaultsite.com"


        feed = FeedModel(
            title=title,
            url=feed_url,  # Ensure url is set for uniqueness
            feed_url=feed_url,
            site_url=site_url,
            folder_id=folder_id
        )
        db_session.add(feed)
        db_session.commit()
        db_session.refresh(feed)
        return feed
    return _create_feed
