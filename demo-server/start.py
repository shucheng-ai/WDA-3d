#!/usr/bin/env python3
# coding:utf-8
import os
from flask import Flask, send_from_directory, send_file

APP_PATH = os.path.abspath(os.path.dirname(__file__))
# TEST = os.path.abspath(os.path.join(APP_PATH, "test.gltf"))
TEST = os.path.abspath(os.path.join(APP_PATH, "design.gltf"))
DESIGN = os.path.abspath(os.path.join(APP_PATH, "design.gltf"))
BIG = os.path.abspath(os.path.join(APP_PATH, "big.gltf"))
STATIC = os.path.abspath(os.path.join(APP_PATH, "static_fixtures.json"))
FIXTURES = os.path.abspath(os.path.join(APP_PATH, "0.json"))

DEBUG = True
HOST = '0.0.0.0'
PORT = 9999

app = Flask(
    __name__,
    static_url_path="/static",
    static_folder=".",
    template_folder=APP_PATH
)


@app.route('/api/test.gltf')
def test():
    return send_file(TEST, attachment_filename='design.gltf', as_attachment=True)


@app.route('/api/design.gltf')
def testdesign():
    return send_file(DESIGN, attachment_filename='design.gltf', as_attachment=True)


@app.route('/api/default.gltf')
def test1():
    return send_file(TEST, attachment_filename='default.gltf', as_attachment=True)


@app.route('/api/output1.gltf')
def test2():
    return send_file(TEST, attachment_filename='output1.gltf', as_attachment=True)


@app.route('/api/output2.gltf')
def test3():
    return send_file(TEST, attachment_filename='output2.gltf', as_attachment=True)


@app.route('/api/big.gltf')
def test4():
    return send_file(BIG, attachment_filename='big.gltf', as_attachment=True)


@app.route('/api/data.json')
def data():
    # return send_file(FIXTURES, attachment_filename='fixtures_for_three.json', as_attachment=True)
    return send_file(STATIC, attachment_filename='static_fixtures.json', as_attachment=True)


@app.route('/api/event/file/download')
def datav1():
    # return send_file(FIXTURES, attachment_filename='fixtures_for_three.json', as_attachment=True)
    return send_file(STATIC, attachment_filename='static_fixtures.json', as_attachment=True)


@app.route('/api/project/fixtures')
def datav2():
    # return send_file(FIXTURES, attachment_filename='fixtures_for_three.json', as_attachment=True)
    return send_file(STATIC, attachment_filename='static_fixtures.json', as_attachment=True)


print(f"app run debug:{DEBUG};host:{HOST},{PORT};debug:{DEBUG}")

app.run(
    debug=DEBUG,
    host=HOST,
    port=PORT
)
