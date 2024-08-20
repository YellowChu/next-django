from django.db.models import Count
from django.shortcuts import get_object_or_404
from ninja import Router, ModelSchema, Schema
from pydantic import field_validator

from post.models import Post, Comment

router = Router()

class PostIn(Schema):
    title: str
    content: str

    @field_validator("title", "content")
    def validate_empty_string(cls, value):
        if value == "":
            raise ValueError("Field cannot be empty")
        return value

class PostOut(ModelSchema):
    comments_count: int

    class Meta:
        model = Post
        fields = ["id", "title", "content", "created", "updated"]

    @staticmethod
    def resolve_comments_count(obj):
        if hasattr(obj, "comments_count"):
            return obj.comments_count
        return obj.comments.count()

@router.get("/posts", response=list[PostOut])
def post_list(request, title: str = None):
    posts = Post.objects.annotate(comments_count=Count("comments")).order_by("-created")
    if title:
        posts = posts.filter(title__icontains=title)
    return posts

@router.get("/posts/{post_id}", response=PostOut)
def post_detail(request, post_id: int):
    post = get_object_or_404(Post, id=post_id)
    return post

@router.post("/posts", response=PostOut)
def post_create(request, data: PostIn):
    post = Post.objects.create(**data.dict())
    return post

@router.put("/posts/{post_id}", response=PostOut)
def post_update(request, post_id: int, data: PostIn):
    post = get_object_or_404(Post, id=post_id)
    for attr, value in data.dict().items():
        setattr(post, attr, value)
    post.save()
    return post

@router.delete("/posts/{post_id}")
def post_delete(request, post_id: int):
    post = get_object_or_404(Post, id=post_id)
    post.delete()
    return 204

class CommentIn(ModelSchema):
    class Meta:
        model = Comment
        fields = ["content"]

class CommentOut(ModelSchema):
    replies: list["CommentOut"] | None = None

    class Meta:
        model = Comment
        fields = ["id", "content", "post", "thread", "created", "updated"]

    @staticmethod
    def resolve_replies(obj):
        if not obj.replies.exists():
            return []
        return [reply for reply in obj.replies.all()]

@router.get("/posts/{post_id}/comments", response=list[CommentOut])
def comment_list(request, post_id: int):
    comments = Comment.objects.filter(post_id=post_id, thread=None).order_by("-created")
    return comments

@router.get("/posts/{post_id}/comments/{comment_id}", response=CommentOut)
def comment_detail(request, post_id: int, comment_id: int):
    comment = get_object_or_404(Comment, post_id=post_id, id=comment_id)
    return comment

@router.post("/posts/{post_id}/comments", response=CommentOut)
def comment_create(request, post_id: int, data: CommentIn):
    comment = Comment.objects.create(post_id=post_id, **data.dict())
    return comment

@router.put("/posts/{post_id}/comments/{comment_id}", response=CommentOut)
def comment_update(request, post_id: int, comment_id: int, data: CommentIn):
    comment = get_object_or_404(Comment, post_id=post_id, id=comment_id)
    for attr, value in data.dict().items():
        setattr(comment, attr, value)
    comment.save()
    return comment

@router.delete("/posts/{post_id}/comments/{comment_id}")
def comment_delete(request, post_id: int, comment_id: int):
    comment = get_object_or_404(Comment, post_id=post_id, id=comment_id)
    comment.delete()
    return 204

@router.post("/posts/{post_id}/comments/{comment_id}/reply", response=CommentOut)
def reply_create(request, post_id: int, comment_id: int, data: CommentIn):
    comment = Comment.objects.create(post_id=post_id, thread_id=comment_id, **data.dict())
    return comment
