from flask.cli import AppGroup
from .users import seed_users, undo_users
from .expenses import seed_expenses, undo_expenses
from .likes import seed_likes, undo_likes
from .places import seed_places, undo_places
from .placeimages import seed_placeimages, undo_placeimages
from .plans import seed_plans, undo_plans
from .stories import seed_stories, undo_stories
from .storyimages import seed_storyimages, undo_storyimages


from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_expenses()
        undo_likes()
        undo_places()
        undo_placeimages()
        undo_plans()
        undo_stories()
        undo_storyimages()

    seed_users()
    seed_expenses()
    seed_likes()
    seed_places()
    seed_placeimages()
    seed_plans()
    seed_stories()
    seed_storyimages()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_expenses()
    undo_likes()
    undo_places()
    undo_placeimages()
    undo_plans()
    undo_stories()
    undo_storyimages()
    # Add other undo functions here
