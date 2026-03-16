import hashlib
import json
from time import time
from flask_cors import CORS


class Blockchain:
    def __init__(self):
        self.chain = []     # temporary database
        self.pending_data = []
        self.create_block(nonce=100, previous_hash='0')

    def create_block(self, nonce, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'data': self.pending_data,
            'nonce': nonce,
            'previous_hash': previous_hash,
        }
        self.pending_data = []
        block['hash'] = self.hash_block(block)
        self.chain.append(block)
        return block

    def get_last_block(self):
        return self.chain[-1]

    def hash_block(self, block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()
    def proof_of_work(self, last_nonce):
        nonce = 0
        while self.valid_proof(last_nonce, nonce) is False:
            nonce += 1
        return nonce

    def valid_proof(self, last_nonce, nonce):
        guess = f'{last_nonce}{nonce}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

    def add_certificate(self, student_name, major, student_id):
        self.pending_data.append({
            'student_name': student_name,
            'major': major,
            'student_id': student_id
        })
        return self.get_last_block()['index'] + 1



from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)
blockchain = Blockchain()

@app.route('/mine', methods=['GET'])
def mine():
    last_block = blockchain.get_last_block()
    last_nonce = last_block['nonce']
    nonce = blockchain.proof_of_work(last_nonce)
    
    previous_hash = last_block['hash'] #sai login nhé

    block = blockchain.create_block(nonce, previous_hash)
    
    response = {
        'message': "New Block Mined",
        'index': block['index'],
        'data': block['data'],
        'nonce': block['nonce'],
        'previous_hash': block['previous_hash'],
        'hash': block['hash']
    }
    return jsonify(response), 200

@app.route('/certificates/new', methods=['POST'])
def new_certificate():
    values = request.get_json()
    required = ['student_name', 'major', 'student_id']
    if not all(k in values for k in required):
        return 'Missing values', 400
    
    index = blockchain.add_certificate(
        values['student_name'], 
        values['major'], 
        values['student_id']
    )
    
    response = {'message': f'Certificate will be added to Block {index}'}
    return jsonify(response), 201

@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


