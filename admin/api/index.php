<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: *");

    require "../configs/conexao.php";

    if (isset ($_GET["param"])) {
        $param = trim($_GET["param"]);
        $param = explode("/", $param);
    }

    // categoria, categorias, produto, produtos
    $opcao = $param[0] ?? NULL;
    // id
    $id = $param[1] ?? NULL;
    $cep_destino = $param[1] ?? NULL; 
    $peso          = $param[2] ?? NULL;
    $valor         = $param[3] ?? NULL;
    $tipo_do_frete = $param[4] ?? NULL;
    $altura        = $param[5] ?? NULL;
    $largura       = $param[6] ?? NULL;
    $comprimento   = $param[7] ?? NULL;

    $resposta = array("erro"=>"Requisição inválida");

    if ( $opcao == "produtos" ) {
        //mostrar todos os produtos cadastrados
        $sql = "select p.*, c.categoria 
        from produtos p
        inner join categorias c on (c.id = p.categorias_id)
        order by p.produto";
        $consulta = $pdo->prepare($sql);
        $consulta->execute();
        $resposta = $consulta->fetchAll(PDO::FETCH_OBJ);
    } else if ( $opcao == "categorias" ) {
        $sql = "select * from categorias 
        order by categoria";
        $consulta = $pdo->prepare($sql);
        $consulta->execute();
        $resposta = $consulta->fetchAll(PDO::FETCH_OBJ);
    } else if ((!empty($id)) AND ($opcao == "produto")) {
        $sql = "SELECT p.*, c.categoria from produtos p
        inner join categorias c on (c.id = p.categorias_id)
        where p.id = :id limit 1";
        $consulta = $pdo->prepare($sql);
        $consulta->bindParam(":id", $id);
        $consulta->execute();

        $conta = $consulta->rowCount();
        if ($conta > 0)
            $resposta = $consulta->fetch(PDO::FETCH_OBJ);
        else
            $resposta = array("erro"=>"Produto não encontrado");

    } else if ((!empty($id)) AND ($opcao == "categoria")) {
        $sql = " SELECT p.*, c.categoria from produtos p 
                inner join categorias c 
                    on c.id = p.categorias_id 
                where c.id = :id 
                order by p.produto";
        $consulta = $pdo->prepare($sql);
        $consulta->bindParam(":id", $id);
        $consulta->execute();
        $resposta = $consulta->fetchAll(PDO::FETCH_OBJ);
    } else if ($opcao == "outros") {
        $sql = "SELECT p.*, c.categoria 
                FROM produtos p
                JOIN categorias c ON (c.id = p.categorias_id)
                ORDER BY rand()
                LIMIT 4";
        $consulta = $pdo->prepare($sql);
        $consulta->execute();
        $resposta = $consulta->fetchAll(PDO::FETCH_OBJ);
    }else if ( (!empty($cep_destino)) AND (!empty($peso))  AND (!empty($valor))  AND (!empty($tipo_do_frete)) AND (!empty($altura)) AND (!empty($largura)) AND (!empty($comprimento)) AND ($opcao == "calcula-frete")) {
        $cep_origem = "87390000";    
    
        $url = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?";
        $url .= "nCdEmpresa=";
        $url .= "&sDsSenha=";
        $url .= "&sCepOrigem=" . $cep_origem;
        $url .= "&sCepDestino=" . $cep_destino;
        $url .= "&nVlPeso=" . $peso;
        $url .= "&nVlLargura=" . $largura;
        $url .= "&nVlAltura=" . $altura;
        $url .= "&nCdFormato=1";
        $url .= "&nVlComprimento=" . $comprimento;
        $url .= "&sCdMaoProria=n";
        $url .= "&nVlValorDeclarado=" . $valor;
        $url .= "&sCdAvisoRecebimento=n";
        $url .= "&nCdServico=" . $tipo_do_frete;
        $url .= "&nVlDiametro=0";
        $url .= "&StrRetorno=xml";
    
        $xmlString = file_get_contents($url);
        $resposta = simplexml_load_string($xmlString);
    }

    echo json_encode($resposta);