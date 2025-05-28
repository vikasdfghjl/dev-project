from app.db.database import engine
from sqlalchemy import text

def check_image_url_column():
    """Check if image_url column exists in articles table"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'articles' AND column_name = 'image_url'
            """))
            
            exists = bool(result.fetchone())
            print(f"image_url column exists: {exists}")
            return exists
            
    except Exception as e:
        print(f"Error checking column: {e}")
        return False

if __name__ == "__main__":
    check_image_url_column()
