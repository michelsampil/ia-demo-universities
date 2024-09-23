import json
import os
from sqlalchemy.orm import Session
from app.db.database import engine
from app.models.score import Score  

def load_scores_from_backup(backup_file: str):
    # Extract directory path from the file
    backup_dir = os.path.dirname(backup_file)

    # Check if the backup directory exists, if not, create it
    if not os.path.exists(backup_dir):
        print(f"Directory {backup_dir} does not exist. Creating it.")
        os.makedirs(backup_dir)

    # Check if the backup file exists, if not, create it with empty data
    if not os.path.exists(backup_file):
        print(f"Backup file {backup_file} not found. Creating a new empty backup file.")
        with open(backup_file, 'w') as f:
            json.dump([], f)  # Initialize the file with an empty list

    # Connect with DB and load scores from backup
    with Session(engine) as session:
        try:
            with open(backup_file, 'r') as f:
                data = json.load(f)

            # Add the backup data to the database
            for entry in data:
                score = Score(
                    user_email=entry['user_email'],
                    value=entry['value'],
                    position=entry['position'],
                    timestamp=entry['timestamp'],
                )
                session.add(score)
            session.commit()

        except json.JSONDecodeError:
            print(f"Error: Failed to decode JSON from {backup_file}. Ensure the file contains valid JSON.")

        except Exception as e:
            print(f"An error occurred while loading scores from {backup_file}: {e}")
