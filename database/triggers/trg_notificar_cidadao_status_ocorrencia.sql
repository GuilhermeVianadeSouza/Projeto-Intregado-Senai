DELIMITER $$
CREATE TRIGGER trg_notificar_cidadao_status_ocorrencia
AFTER INSERT ON tb_historico_status
FOR EACH ROW
BEGIN

DECLARE cidadao_id INT;
    DECLARE mensagem_notificacao VARCHAR(70);

    SELECT id_cidadao INTO cidadao_id
    FROM tb_ocorrencia
    WHERE id = NEW.id_ocorrencia;

SET mensagem_notificacao = CONCAT('O status da sua ocorrência foi atualizado.');

IF cidadao_id IS NOT NULL THEN
        INSERT INTO tb_notificacao (mensagem, data_envio, id_cidadao)
        VALUES (
            mensagem_notificacao,
            NOW(),
            cidadao_id
        );
    END IF;
END $$
DELIMITER ;