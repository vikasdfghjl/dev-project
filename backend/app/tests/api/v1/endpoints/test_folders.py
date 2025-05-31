# backend/app/tests/api/v1/endpoints/test_folders.py
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.models import Folder as FolderModel # Alias to avoid name clash
from app.schemas.folder import FolderCreate, FolderUpdate # FolderCreate/Update not directly used in these tests but good for context


# Helper function to create folder via API for reuse in tests
# This remains as it's specific to API testing with TestClient
def _create_folder_via_api(client: TestClient, name: str) -> dict: # Renamed for clarity (internal helper)
    response = client.post("/api/v1/folders/", json={"name": name})
    return response

class TestFolderEndpoints:

    def test_create_folder_success(self, client: TestClient, db_session: Session):
        folder_name = "Test Folder Create"
        response = _create_folder_via_api(client, folder_name)
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == folder_name
        assert "id" in data
        assert data["feeds"] == [] # As per requirements

        # Verify in DB
        folder_id = data["id"]
        db_folder = db_session.query(FolderModel).filter(FolderModel.id == folder_id).first()
        assert db_folder is not None
        assert db_folder.name == folder_name

    def test_create_folder_duplicate_name(self, client: TestClient, db_session: Session): # db_session might not be strictly needed if not verifying DB directly after API call
        folder_name = "Unique Folder Name"
        # Create first folder
        response1 = _create_folder_via_api(client, folder_name)
        assert response1.status_code == 201

        # Attempt to create second folder with the same name
        response2 = _create_folder_via_api(client, folder_name)
        assert response2.status_code == 400
        data = response2.json()
        assert "detail" in data
        # Check specific error message if consistent
        # assert data["detail"] == "Folder with this name already exists"

    def test_create_folder_invalid_data(self, client: TestClient):
        # Test with empty name
        response_empty_name = _create_folder_via_api(client, "")
        assert response_empty_name.status_code == 422

        # Test with name exceeding max length (Folder model: String(100))
        long_name = "a" * 101 
        response_long_name = _create_folder_via_api(client, long_name)
        assert response_long_name.status_code == 422

    def test_list_folders_empty(self, client: TestClient):
        response = client.get("/api/v1/folders/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_folders_with_content(self, client: TestClient, db_session: Session): # db_session not strictly needed here if relying on API state
        folder_name1 = "Folder Alpha"
        folder_name2 = "Folder Beta"
        
        resp1 = _create_folder_via_api(client, folder_name1)
        assert resp1.status_code == 201
        id1 = resp1.json()["id"]

        resp2 = _create_folder_via_api(client, folder_name2)
        assert resp2.status_code == 201
        id2 = resp2.json()["id"]

        response = client.get("/api/v1/folders/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        
        # Verify structure and content (order might not be guaranteed)
        folder_names_in_response = {f["name"] for f in data}
        folder_ids_in_response = {f["id"] for f in data}

        assert folder_name1 in folder_names_in_response
        assert folder_name2 in folder_names_in_response
        assert id1 in folder_ids_in_response
        assert id2 in folder_ids_in_response
        for item in data:
            assert item["feeds"] == []

    def test_rename_folder_success(self, client: TestClient, db_session: Session):
        original_name = "Old Name"
        new_name = "New Name"

        create_response = _create_folder_via_api(client, original_name)
        assert create_response.status_code == 201
        folder_id = create_response.json()["id"]

        rename_response = client.put(f"/api/v1/folders/{folder_id}", json={"name": new_name})
        assert rename_response.status_code == 200
        data = rename_response.json()
        assert data["id"] == folder_id
        assert data["name"] == new_name
        assert data["feeds"] == []

        # Verify in DB
        db_folder = db_session.query(FolderModel).filter(FolderModel.id == folder_id).first()
        assert db_folder is not None
        assert db_folder.name == new_name

    def test_rename_folder_non_existent(self, client: TestClient):
        non_existent_id = 99999
        response = client.put(f"/api/v1/folders/{non_existent_id}", json={"name": "Doesnt Matter"})
        assert response.status_code == 404

    def test_rename_folder_to_duplicate_name(self, client: TestClient, folder_factory): # Use folder_factory if direct DB setup is preferred
        name1 = "Existing Name 1"
        name2 = "Existing Name 2"

        # Create via API to test API-level duplicate check during rename
        folder1_resp = _create_folder_via_api(client, name1)
        assert folder1_resp.status_code == 201
        folder1_id = folder1_resp.json()["id"]
        
        _ = _create_folder_via_api(client, name2) # Create the second folder that name1 will conflict with
        assert _.status_code == 201


        # Try to rename folder1 to folder2's name
        response = client.put(f"/api/v1/folders/{folder1_id}", json={"name": name2})
        assert response.status_code == 400

    def test_rename_folder_invalid_data(self, client: TestClient, db_session: Session): # db_session for potential direct verification if needed
        folder_name = "Valid Original Name"
        create_response = _create_folder_via_api(client, folder_name)
        assert create_response.status_code == 201
        folder_id = create_response.json()["id"]

        # Test with empty name
        response_empty_name = client.put(f"/api/v1/folders/{folder_id}", json={"name": ""})
        assert response_empty_name.status_code == 422

        # Test with name too long (Folder model: String(100))
        long_name = "b" * 101
        response_long_name = client.put(f"/api/v1/folders/{folder_id}", json={"name": long_name})
        assert response_long_name.status_code == 422

    def test_delete_folder_success(self, client: TestClient, db_session: Session):
        folder_name = "To Be Deleted"
        create_response = _create_folder_via_api(client, folder_name)
        assert create_response.status_code == 201
        folder_id = create_response.json()["id"]

        delete_response = client.delete(f"/api/v1/folders/{folder_id}")
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert data["message"] == "Folder deleted successfully"

        # Verify in DB
        db_folder = db_session.query(FolderModel).filter(FolderModel.id == folder_id).first()
        assert db_folder is None

    def test_delete_folder_non_existent(self, client: TestClient):
        non_existent_id = 88888 # Consider using uuid.uuid4() for non_existent_ids
        response = client.delete(f"/api/v1/folders/{non_existent_id}")
        assert response.status_code == 404

    # Test for deleting folder with feeds would require feed creation logic first.
    # This is more of an integration test between folder and feed services/models.
    # def test_delete_folder_with_feeds(self, client: TestClient, db_session: Session, feed_factory):
    # pass

