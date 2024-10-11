-- MySQL Script generated by MySQL Workbench
-- Thu Oct 10 23:14:08 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema feiradatroca
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema feiradatroca
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `feiradatroca` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `feiradatroca` ;

-- -----------------------------------------------------
-- Table `feiradatroca`.`turma`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feiradatroca`.`turma` (
  `idturma` VARCHAR(11) NOT NULL,
  `patrono` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idturma`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `feiradatroca`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feiradatroca`.`cliente` (
  `idcliente` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `turmaid` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`idcliente`),
  INDEX `fk_turma_cliente_idx` (`turmaid` ASC) VISIBLE,
  CONSTRAINT `fk_turma_cliente`
    FOREIGN KEY (`turmaid`)
    REFERENCES `feiradatroca`.`turma` (`idturma`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;