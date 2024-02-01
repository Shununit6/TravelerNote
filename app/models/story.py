from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Story(db.Model):
    __tablename__ = 'story'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("user.id")), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("place.id")), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    article_url = db.Column(db.String(255), nullable=True)
    shorts_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='stories')
    place = db.relationship('Place', back_populates = 'stories')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'place_id': self.place_id,
            'title': self.user_id,
            'desciption': self.description,
            'article_url': self.article_url,
            'shorts_url': self.shorts_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }