from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    return conn

@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.get_json()
    # Check if user exists, if not create
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM users WHERE email = %s', (data['email'],))
    user = cur.fetchone()
    if user:
        # update user info if needed?
        pass
    else:
        # create user
        cur.execute(
            'INSERT INTO users (name, email, org, role, points, badges) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *',
            (data['name'], data['email'], data['org'], data['role'], 0, 0)
        )
        user = cur.fetchone()
        conn.commit()
    cur.close()
    conn.close()
    return jsonify(user)

@app.route('/api/user', methods=['GET', 'POST'])
def user():
    if request.method == 'GET':
        email = request.args.get('email')
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify(user)
    elif request.method == 'POST':
        data = request.get_json()
        # update user
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            'UPDATE users SET points=%s, badges=%s WHERE email=%s RETURNING *',
            (data['points'], data['badges'], data['email'])
        )
        user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return jsonify(user)

# Similarly, we will create endpoints for resources, union_docs, leaderboard, etc.

if __name__ == '__main__':
    app.run(debug=True)