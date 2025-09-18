from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT', 5432)
    )
    return conn

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('SELECT id, title, description, points, image_url FROM challenges WHERE active = TRUE')
        challenges = []
        for row in cur.fetchall():
            challenges.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'points': row[3],
                'image_url': row[4]
            })
        
        cur.close()
        conn.close()
        
        return jsonify(challenges), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/challenges/submit', methods=['POST'])
def submit_challenge():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        challenge_id = data.get('challenge_id')
        notes = data.get('notes', '')
        media_url = data.get('media_url', '')
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get challenge points
        cur.execute('SELECT points FROM challenges WHERE id = %s', (challenge_id,))
        result = cur.fetchone()
        if not result:
            cur.close()
            conn.close()
            return jsonify({'error': 'Challenge not found'}), 404
            
        points = result[0]
        
        # Insert submission
        cur.execute(
            'INSERT INTO challenge_submissions (user_id, challenge_id, notes, media_url, points_earned) VALUES (%s, %s, %s, %s, %s)',
            (user_id, challenge_id, notes, media_url, points)
        )
        
        # Update user points
        cur.execute(
            'UPDATE users SET points = points + %s WHERE id = %s',
            (points, user_id)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'message': 'Challenge submitted successfully', 'points_earned': points}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500