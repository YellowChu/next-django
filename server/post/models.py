from django.db import models

class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=100)
    content = models.TextField()

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return self.title


class Comment(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    content = models.TextField()
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    thread = models.ForeignKey("self", related_name="replies", on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return f"{self.post.title} - {self.content[:20]}"