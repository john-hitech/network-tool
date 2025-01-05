#!/bin/bash

echo "Enter Virtual Environment"
source ./.venv/bin/activate

echo "Running Pyinstaller"
pyinstaller --onefile main.py