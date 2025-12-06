export async function buscarOcorrencias(limite, pagina, filtros = {}) {
    const url = new URL('http://localhost:8080/v1/ocorrencia');
    url.searchParams.append("limite", limite);
    url.searchParams.append("pagina", pagina);

    if (filtros.categoria) {
        url.searchParams.append("categoria", filtros.categoria);
    }
    if (filtros.status) {
        url.searchParams.append("status", filtros.status);
    }
    if (filtros.data_registro) {
        url.searchParams.append("data_registro", filtros.data_registro);
    }
    if (filtros.ordenar) {
        url.searchParams.append("ordenar", filtros.ordenar)
    }
    try {
        const response = await fetch(url);

        if (!response.ok) {

            throw new Error('Erro na requisição');

        }
        const dados = await response.json();

        return dados.ocorrencias;

    } catch (error) {
        return [];

    }

}