from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from datetime import datetime
import jwt
import hashlib

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT', 5432)
    )
    return conn

# JWT secret key
JWT_SECRET = os.getenv('JWT_SECRET', 'ecoquest-secret-key')

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')  # In a real app, this should be hashed
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            'SELECT id, name, email, org, role, points, badges FROM users WHERE email = %s AND password = %s',
            (email, hashlib.sha256(password.encode()).hexdigest())
        )
        user = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if user:
            # Create JWT token
            token = jwt.encode({
                'user_id': user[0],
                'exp': datetime.utcnow() + timedelta(days=7)
            }, JWT_SECRET, algorithm='HS256')
            
            return jsonify({
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'org': user[3],
                'role': user[4],
                'points': user[5],
                'badges': user[6],
                'token': token
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        org = data.get('org')
        role = data.get('role')
        password = data.get('password')  # In a real app, this should be hashed
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if user already exists
        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'User already exists'}), 409
        
        # Create new user
        cur.execute(
            'INSERT INTO users (name, email, org, role, password, points, badges) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id',
            (name, email, org, role, hashlib.sha256(password.encode()).hexdigest(), 0, 0)
        )
        user_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        # Create JWT token
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'id': user_id,
            'name': name,
            'email': email,
            'org': org,
            'role': role,
            'points': 0,
            'badges': 0,
            'token': token
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500