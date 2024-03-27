CREATE TABLE features (
  feature_id INT AUTO_INCREMENT PRIMARY KEY,
  feature_name VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL
);


CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


CREATE TABLE role_features (
  role_id INT,
  feature_id INT,
  enabled BOOLEAN,
  access ENUM('none', 'read', 'write'),
  PRIMARY KEY (role_id, feature_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (feature_id) REFERENCES features(feature_id)
);