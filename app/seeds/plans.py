from app.models import db, Plan, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo plan, you can add other plans here if you want
def seed_plans():
    planone = Plan(
        user_id=1, name='Summer Vacation', number_traveler='5', private=0, city='Honolulu', country='United States', start_date='2024-08-08', end_date='2024-08-16')
    plantwo = Plan(
        user_id=2, name='Family Trip', number_traveler='8', private=0, city='Cabo San Lucas', country='Mexico', start_date='2024-11-11', end_date='2024-11-16')
    planthree = Plan(
        user_id=3, name='Anniversary', number_traveler='2', private=0, city='Bangkok', country='Thailand', start_date='2025-01-11', end_date='2025-01-18')
    planfour = Plan(
        user_id=1, name='Park', number_traveler='6', private=0, city='San Francisco', country='United States', start_date='2024-04-10', end_date='2024-04-11')
    planfive = Plan(
        user_id=2, name='Europe Tour', number_traveler='4', private=0, city='Paris', country='France', start_date='2025-06-12', end_date='2025-06-24')
    plansix = Plan(
        user_id=3, name='Asia Trip', number_traveler='2', private=0, city='Tokyo', country='Japan', start_date='2024-05-04', end_date='2024-05-10')
    planseven = Plan(
        user_id=1, name="Eric's Wedding", number_traveler='5', private=1, city='Napa', country='United States', start_date='2025-07-02', end_date='2025-07-04')

    db.session.add(planone)
    db.session.add(plantwo)
    db.session.add(planthree)
    db.session.add(planfour)
    db.session.add(planfive)
    db.session.add(plansix)
    db.session.add(planseven)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_plans():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.plans RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM plans"))

    db.session.commit()
