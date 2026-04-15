from database import SessionLocal
from models import User

def seed_test_data():
    # 1. Open a manual session
    db = SessionLocal()
    
    try:
        # 2. Create a dummy user object based on your model
        test_user = User(
            name="Irfan Test",
            email="irfan@example.com",
            picture="https://via.placeholder.com/150"
        )
        
        # 3. Add and Commit to the database
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"✅ Success! User '{test_user.name}' has been stored with ID: {test_user.id}")
        
    except Exception as e:
        print(f"❌ Error while seeding: {e}")
        db.rollback()
    finally:
        # 4. Always close the session
        db.close()

if __name__ == "__main__":
    seed_test_data()