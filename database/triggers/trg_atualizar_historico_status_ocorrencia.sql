set autocommit = OFF;
START TRANSACTION;

DELIMITER $$
CREATE TRIGGER trg_atualizar_historico_status_ocorrencia
AFTER INSERT ON tb_ocorrencia
FOR EACH ROW
BEGIN
	INSERT INTO tb_historico_status(data_hora, id_status, id_ocorrencia)
    VALUES(
    NEW.data_registro,
	1,
    NEW.id
		);
END $$
DELIMITER ;

commit;