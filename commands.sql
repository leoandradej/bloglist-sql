CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Dan Abramov', 'https://overreacted.io/on-let-vs-const', 'On let vs const', 5);
INSERT INTO blogs (author, url, title) VALUES ('Matti Luukkainen', 'https://mooc.fi', 'Kun MOOCit Helsingin yliopistoon tulivat');
