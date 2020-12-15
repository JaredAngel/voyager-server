ALTER TABLE activities
  DROP COLUMN IF EXISTS label;

DROP TYPE IF EXISTS activity_label;

--DROP TYPE IF EXISTS star_rating;

DROP TABLE IF EXISTS activities;