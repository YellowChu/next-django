from ninja import NinjaAPI

from post.api import router as post_router

api = NinjaAPI()

api.add_router("/", post_router)
