CREATE TABLE features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature_name VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) 
);

CREATE TABLE role_features (
  role_id INT,
  feature_id INT,
  enabled BOOLEAN NOT NULL, 
  access ENUM('none', 'read', 'write') NOT NULL, 
  PRIMARY KEY (role_id, feature_id),
  FOREIGN KEY (role_id) REFERENCES roles(id), 
  FOREIGN KEY (feature_id) REFERENCES features(id) 
);
