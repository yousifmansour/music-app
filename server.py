from flask import Flask
from music_utils.music import get_music

app = Flask(__name__)


@app.route('/music/<notes>')
def music(notes):
    music_output = get_music(list(map(int, notes.split(","))))
    return "\n".join(list(map(str, music_output))).replace('[', '').replace(']', '')


@app.route('/')
def landing():
    return 'welcome to music app'


if __name__ == '__main__':
    app.run(debug=True)
