//INFORMATION NEEDED TO GET CONNECTED WITH THE MYSQL SERVER
// module.exports = {
//     HOST: "localhost",
//     USER: "user2",
//     PASSWORD: "admin",
//     //Here the db of mysql is defined.EVen if you make another one the table will be created in t his folder
//     DB: 'users_matanks'
// };

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    //Here the db of mysql is defined.EVen if you make another one the table will be created in t his folder
    DB: 'users_matanks'
};

// IF THE DB FAILS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//backup data and turn restore into data. Then go to php admit and input this query

// Old version - until 27/02/2023
// CREATE TABLE `usermanagement`.`user` ( `id` INT NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(45) NOT NULL , `last_name` VARCHAR(45) NOT NULL , `email` VARCHAR(45) NOT NULL , `phone` VARCHAR(45) NOT NULL , `comments` TEXT NOT NULL , `status` VARCHAR(10) NOT NULL DEFAULT 'active' , PRIMARY KEY (`id`)) ENGINE = InnoDB;


// New version - from 27/02/2023
// CREATE TABLE `users_matanks`.`user2` ( `id` INT NOT NULL AUTO_INCREMENT , `unique_id` INT NOT NULL , `name` VARCHAR(45) NOT NULL , `surname` VARCHAR(45) NOT NULL ,  `status` VARCHAR(10) NOT NULL DEFAULT 'active' , PRIMARY KEY (`id`)) ENGINE = InnoDB;