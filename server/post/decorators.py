from functools import wraps
from typing import Callable

from post.models import Comment, MAX_COMMENTS_PER_POST

def max_comments(*args, **kwargs):
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            post_id = kwargs.get("post_id")
            post_comments_count = Comment.objects.filter(post_id=post_id).count()
            if post_comments_count >= MAX_COMMENTS_PER_POST:
                return 400, {"msg": "Max comments reached"}
            return func(request, *args, **kwargs)

        return wrapper
    return decorator
