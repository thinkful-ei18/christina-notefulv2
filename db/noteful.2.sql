--`psql -U dev -f ./db/noteful.2.sql -d noteful-app`
SELECT CURRENT_DATE;

DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS folders;

CREATE TABLE folders (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE
);
ALTER SEQUENCE folders_id_seq RESTART WITH 100;

CREATE TABLE tags (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE notes (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT now()
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1000;
ALTER TABLE notes ADD COLUMN folder_id int REFERENCES folders ON DELETE SET NULL; -- or RESTRICT
ALTER TABLE notes ADD COLUMN tag_id int REFERENCES tags ON DELETE SET NULL;

CREATE TABLE notes_tags (
  note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);

INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

INSERT INTO notes (title, content, folder_id) VALUES 
  (
    '5 life lessons learned from cats',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    100
  ),
  (
    'What the government doesn''t want you to know about cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat ',
    101
  ),
  (
    'The most boring article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
    102
  ),
  (
    '7 things lady gaga has in common with cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. ',
    103
  ),
  (
    'The most incredible article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet, boring consectetur adipiscing elit',
    100
  );


INSERT INTO tags (name) VALUES 
  ('foo'),
  ('bar'),
  ('baz'),
  ('qux');

INSERT INTO notes_tags (note_id, tag_id) VALUES 
(1001, 1),
(1002, 1), (1002, 2),
(1003, 1), (1003, 2), (1003, 3),
(1004, 1), (1004, 2), (1004, 3), (1004, 4);