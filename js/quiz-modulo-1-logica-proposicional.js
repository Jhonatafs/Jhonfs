// Respostas corretas para o quiz de negação
const correctAnswersNegação = {
  q_neg_truth_value: "V", // A resposta correta para o valor de verdade de ¬Q é V
};

function checkQuizNegacao() {
  // Pega o valor selecionado pelo usuário
  const userAnswerElement = document.querySelector(
    'input[name="q_neg_truth_value"]:checked'
  );
  const feedbackElement = document.getElementById("feedback-1-1-4-1-1");

  // Limpa feedback anterior e classes
  feedbackElement.innerHTML = "";
  feedbackElement.classList.remove("correct", "incorrect", "info");
  feedbackElement.style.display = "none"; // Garante que está oculto antes de mostrar

  if (userAnswerElement) {
    const userAnswer = userAnswerElement.value;
    if (userAnswer === correctAnswersNegação.q_neg_truth_value) {
      feedbackElement.innerHTML =
        "<p><strong>Correto!</strong> Se $Q$ é Falsa, então $\neg Q$ é Verdadeira.</p>";
      feedbackElement.classList.add("correct");
    } else {
      feedbackElement.innerHTML =
        "<p><strong>Incorreto.</strong> Lembre-se que a negação inverte o valor de verdade. Se $Q$ é Falsa, $\neg Q$ deve ser Verdadeira.</p>";
      feedbackElement.classList.add("incorrect");
    }
    feedbackElement.style.display = "block"; // Mostra o feedback
  } else {
    feedbackElement.innerHTML = "<p>Por favor, selecione uma resposta.</p>";
    feedbackElement.classList.add("info"); // Ou uma classe de 'aviso'
    feedbackElement.style.display = "block";
  }
}

// --- Estrutura geral para quizzes mais complexos ---

// Objeto para armazenar as respostas corretas de todos os quizzes
// A chave seria o ID do quiz (ex: 'quiz-1-1-2')
const allCorrectAnswers = {
  "quiz-1-1-2": {
    // Exemplo para o primeiro quiz (o mais complexo)
    q1_is_prop: true, // Checkbox (true se marcado, false se não)
    q1_truth_value: "V", // Radio
    q1_justification:
      "É uma afirmação declarativa com valor de verdade definido (Verdadeiro).", // Resposta modelo para IA ou para mostrar
    q2_is_prop: false,
    q2_truth_value: "NA",
    q2_justification: "É uma pergunta, não uma declaração.",
    // ... e assim por diante para as 8 questões ...
    q8_is_prop: true, // Ex: "Amanhã fará sol." - é uma proposição, mesmo que o valor seja incerto no momento da escrita, ele será V ou F.
    q8_truth_value: "NA", // Ou, se quiser forçar uma verificação no momento: V/F. Para o quiz, 'NA' ou uma explicação.
    q8_justification:
      "É uma afirmação sobre um evento futuro que terá um valor de verdade definido.",
  },
  "quiz-1-1-4-1": {
    q_neg_truth_value: "V",
  },
  "quiz-1-1-4-2": {
    q_conj_a_truth_value: "F", // P (V) AND Q (F) -> F
    q_conj_b_truth_value: "V", // P (V) AND (NOT R (V)) -> V
    q_conj_c_truth_value: "V", // (NOT Q (V)) AND (NOT R (V)) -> V
  },
  "quiz-1-1-4-3": {
    q_disj_a_truth_value: "V", // P (V) OR Q (F) -> V
    q_disj_b_truth_value: "F", // Q (F) OR R (F) -> F
    q_disj_c_truth_value: "V", // P (V) OR (NOT R (V)) -> V
  },
  "quiz-1-1-4-4": {
    q_impl_a_truth_value: "V", // P(V) -> Q(V) => V
    q_impl_b_truth_value: "V", // P(F) -> Q(V) => V
    q_impl_c_truth_value: "V", // P(F) -> Q(F) => V
    q_impl_d_possible: "nao", // Não é possível P ser V e Q ser F neste contexto.
  },
  "quiz-1-1-4-5": {
    q_equiv_a_truth_value: "V",
    q_equiv_b_truth_value: "F",
    q_equiv_c_truth_value: "F",
    q_equiv_d_truth_value: "V",
  },
  "quiz-1-1-5": {
    q_fbf_1a_truth_value: "F", // P(V) -> (Q(F) AND R(V)) => V -> F => F
    q_fbf_1b_truth_value: "F", // (P(V) -> Q(F)) AND R(V) => F AND V => F
    q_fbf_1c_truth_value: "V", // NOT(P(V) OR NOT Q(V)) <-> (R(V) -> NOT P(F)) => NOT(V OR V) <-> (V -> V) => NOT(V) <-> V => F <-> V => F. Ops, refazendo:
    // ¬(P ∨ ¬Q) ↔ (R → ¬P)
    // ¬(V ∨ ¬F) ↔ (V → ¬V)
    // ¬(V ∨  V) ↔ (V →  F)
    // ¬(   V   ) ↔ (   F   )
    //     F     ↔     F      => V
    q_fbf_2_parentheses: "((((¬P) ∨ (Q ∧ R)) → S) ↔ T)", // Ou uma variação aceitável com menos parênteses se a precedência for bem definida
  },
};

// Função genérica para verificar quizzes com múltiplas questões
function checkQuiz(quizId) {
  const quizAnswers = allCorrectAnswers[quizId];
  if (!quizAnswers) {
    console.error("Respostas não encontradas para o quiz:", quizId);
    return;
  }

  const formElements = document.querySelectorAll(`#${quizId} .question-item`);

  formElements.forEach((item) => {
    const questionId = item.id; // ex: q-1-1-2-1
    const baseName = questionId.replace(/-/g, "_").substring(2); // ex: 1_1_2_1. Ajuste conforme a sua nomenclatura de 'name' nos inputs.

    const feedbackElement = item.querySelector(".feedback");
    feedbackElement.innerHTML = "";
    feedbackElement.classList.remove("correct", "incorrect", "info");
    feedbackElement.style.display = "none";

    let allCorrectInItem = true;
    let messages = [];

    // Iterar sobre os tipos de input que você tem (checkbox, radio, text, textarea)
    // Esta parte precisa ser adaptada para como você nomeou os inputs e como quer verificar cada um

    // Exemplo para 'quiz-1-1-2', que é mais complexo
    if (quizId === "quiz-1-1-2") {
      const questionNumber = questionId.split("-").pop(); // Pega o número da questão: 1, 2, ... 8
      const checkbox = item.querySelector(
        `input[name="q${questionNumber}_is_prop"]`
      );
      const radioSelected = item.querySelector(
        `input[name="q${questionNumber}_truth_value"]:checked`
      );
      const justification = item.querySelector(
        `textarea[name="q${questionNumber}_justification"]`
      );

      let currentQuestionCorrect = true;

      // Verificar checkbox "É uma proposição?"
      const isPropUser = checkbox ? checkbox.checked : undefined;
      const isPropCorrect = quizAnswers[`q${questionNumber}_is_prop`];
      if (isPropUser !== undefined && isPropUser === isPropCorrect) {
        messages.push("<p>Identificação de proposição: Correta.</p>");
      } else if (isPropUser !== undefined) {
        messages.push(
          `<p>Identificação de proposição: Incorreta. Resposta esperada: ${
            isPropCorrect ? "Sim" : "Não"
          }.</p>`
        );
        currentQuestionCorrect = false;
      }

      // Verificar Valor de Verdade (Radio)
      const truthValueUser = radioSelected ? radioSelected.value : undefined;
      const truthValueCorrect = quizAnswers[`q${questionNumber}_truth_value`];
      if (truthValueUser && truthValueUser === truthValueCorrect) {
        messages.push("<p>Valor de verdade: Correto.</p>");
      } else if (truthValueUser) {
        messages.push(
          `<p>Valor de verdade: Incorreto. Resposta esperada: ${truthValueCorrect}.</p>`
        );
        currentQuestionCorrect = false;
      } else if (isPropUser === true && !truthValueUser) {
        // Se marcou como proposição mas não deu valor
        messages.push(
          "<p>Valor de verdade: Por favor, selecione um valor.</p>"
        );
        currentQuestionCorrect = false;
      }

      // Justificativa (para este exemplo, apenas mostra a resposta modelo)
      const justificationCorrect =
        quizAnswers[`q${questionNumber}_justification`];
      if (justificationCorrect) {
        messages.push(
          `<p><em>Explicação Modelo:</em> ${justificationCorrect}</p>`
        );
      }
      // Aqui você poderia adicionar a lógica de IA ou apenas mostrar a resposta modelo.

      if (currentQuestionCorrect) {
        feedbackElement.classList.add("correct");
      } else {
        feedbackElement.classList.add("incorrect");
      }
      feedbackElement.innerHTML = messages.join("");
      feedbackElement.style.display = "block";
    } else {
      // Lógica para outros quizzes mais simples
      // Para quizzes com um único input por question-item (como radio buttons diretos)
      const inputs = item.querySelectorAll(
        'input[type="radio"], input[type="checkbox"], input[type="text"], textarea'
      );
      inputs.forEach((input) => {
        const inputName = input.name;
        const correctAnswer = quizAnswers[inputName];
        let userAnswer;

        if (input.type === "radio") {
          if (input.checked) {
            userAnswer = input.value;
          } else {
            return; // Só processa o radio selecionado
          }
        } else if (input.type === "checkbox") {
          userAnswer = input.checked; // true ou false
        } else {
          // text, textarea
          userAnswer = input.value.trim();
        }

        if (
          userAnswer !== undefined &&
          String(userAnswer) === String(correctAnswer)
        ) {
          // Comparar como string para consistência
          messages.push(
            `<p>Resposta para "${
              input.closest(".question-item").querySelector("p")
                ? input
                    .closest(".question-item")
                    .querySelector("p")
                    .textContent.trim()
                : inputName
            }": Correta!</p>`
          );
        } else if (userAnswer !== undefined) {
          messages.push(
            `<p>Resposta para "${
              input.closest(".question-item").querySelector("p")
                ? input
                    .closest(".question-item")
                    .querySelector("p")
                    .textContent.trim()
                : inputName
            }": Incorreta. Resposta esperada: ${correctAnswer}.</p>`
          );
          allCorrectInItem = false;
        } else if (!input.name.includes("justification")) {
          // Não penalizar se for campo de justificação vazio
          messages.push(
            `<p>Por favor, forneça uma resposta para "${inputName}".</p>`
          );
          allCorrectInItem = false;
        }
      });
      if (messages.length > 0) {
        // Só mostrar feedback se houver algo a dizer
        if (allCorrectInItem) {
          feedbackElement.classList.add("correct");
        } else {
          feedbackElement.classList.add("incorrect");
        }
        feedbackElement.innerHTML = messages.join("");
        feedbackElement.style.display = "block";
      }
    }
  });
}
// Nota: O quiz 'quiz-1-1-5' questão 2 (parentização) precisará de uma lógica de verificação de string mais sofisticada
// ou uma comparação com múltiplas respostas corretas aceitáveis.
// A lógica acima para 'checkQuiz' é um ponto de partida e precisará ser refinada para cada quiz específico,
// especialmente para o 'quiz-1-1-2' e a questão de parentização.
