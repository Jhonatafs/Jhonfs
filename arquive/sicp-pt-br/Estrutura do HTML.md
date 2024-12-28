Estou traduzindo o livro SICP, e preciso que a tradução seja a mim entregue em formatação HTML tendo como base a seguinte estrutura:
<!--Content-->
<article>
    <!--Titulo de referência-->
    <span id="chapter">Capítulo 1</span>
    <h1><!--Titulo da página--></h1>
    <!---Caso tenha algum Quot será definido assim:-->
    <span class="quote"></span>
    <!--Ps. Se o texto tiver um quote o primeiro paragrafo terá uma classe chamada word-cappilar-->
    <p><!--Texto--></p>
    <!--Os códigos serão estruturados da seguinte forma-->
    <pre><code class="language-scheme"></code></pre>
    <!--Porém quando nos paragrafos terá a seguinte estrutura-->
    <p><!--Texto--><span class="code"><!--Codigo--></span><!--Texto--></p>
    <!--Caso tenha figuras inslustrativas será assim:-->
    <figure>
        <img src="/img/sicp-pt-br/" alt="">
        <figcaption>Figura ...</figcaption>
    </figure>
    <!--Nos paragrafos a referências de notas de rodapé, essas referÊncias devem ser estruturadas assim:-->
    <p><!--No inicio do paragrafo vai uma tag sup para identifica-la--><sup id="note-17"></sup><!--Texto--><!--Finalizando com outra tag sup, a qual será o link para a nota de rodapé--><sup><a href="#footnote-17">17</a></sup></p>
    <!--A nota de rodapé é estruturada da seguinte forma:-->
    <hr id="footnote-line">
    <section id="footnotes">
        <p id="footnote-17"><sup><a href="#note-17">17</a></sup> <!--Texto--></p>
    </section>
    <!--Ps. Os comentários é para lhe descrever como funciona e não deve haver na tradução final-->
</article>