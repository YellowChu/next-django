import pytest
from django.test import Client

from post.models import Comment, Post

@pytest.fixture
def client():
    return Client()

@pytest.fixture
def post(db):
    return Post.objects.create(title="Title", content="Content")

@pytest.fixture
def post_comment(db, post):
    return Comment.objects.create(content="Comment", post=post)

@pytest.fixture
def comment_reply(db, post_comment):
    return Comment.objects.create(content="Reply", post=post_comment.post, thread=post_comment)

def test_post_create(db, client):
    data = {"title": "My post", "content": "Hello world"}
    response = client.post("/api/posts", data, content_type="application/json")

    assert response.status_code == 200
    assert Post.objects.count() == 1
    post = Post.objects.first()
    assert post.title == "My post"
    assert post.content == "Hello world"

def test_post_update(post, client):
    data = {"title": "Updated title", "content": "Updated content"}
    response = client.put(f"/api/posts/{post.id}", data, content_type="application/json")

    assert response.status_code == 200
    post.refresh_from_db()
    assert post.title == "Updated title"
    assert post.content == "Updated content"

def test_post_add_comment(post, client):
    response = client.get(f"/api/posts/{post.id}")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["comments_count"] == 0

    # add comment
    data = {"content": "My comment"}
    client.post(f"/api/posts/{post.id}/comments", data, content_type="application/json")

    response = client.get(f"/api/posts/{post.id}")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["comments_count"] == 1

def test_post_comment_reply(post, post_comment, client):
    response = client.get(f"/api/posts/{post.id}/comments/{post_comment.id}")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["replies"] == []

    # add reply
    data = {"content": "My reply"}
    client.post(f"/api/posts/{post.id}/comments/{post_comment.id}/reply", data, content_type="application/json")

    response = client.get(f"/api/posts/{post.id}/comments/{post_comment.id}")
    assert response.status_code == 200
    response_json = response.json()
    assert len(response_json["replies"]) == 1

def test_remove_comment_with_reply(post, post_comment, comment_reply, client):
    assert post.comments.count() == 2
    client.delete(f"/api/posts/{post.id}/comments/{post_comment.id}")
    post.refresh_from_db()
    assert post.comments.count() == 0
