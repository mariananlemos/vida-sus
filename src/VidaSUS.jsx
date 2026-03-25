import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// DADOS MOCKADOS
// ============================================================================
const MOCK_DATA = {
  usuario: {
    nome: 'Maria',
    idade: 67,
    cpf: '***.***.***-12',
    cartaoSUS: '7001 2345 6789 0001',
  },
  familia: [
    {
      id: 1,
      nome: 'Maria',
      relacao: 'Você',
      idade: 67,
      avatar: '👩‍🦳',
      alertas: ['Vacina da gripe em atraso'],
      proximoRetorno: '15/04/2026 - Cardiologista',
    },
    {
      id: 2,
      nome: 'João',
      relacao: 'Marido',
      idade: 70,
      avatar: '👴',
      alertas: [],
      proximoRetorno: '22/03/2026 - Clínico Geral',
    },
    {
      id: 3,
      nome: 'Ana',
      relacao: 'Filha',
      idade: 8,
      avatar: '👧',
      alertas: ['Vacina de reforço pendente'],
      proximoRetorno: '10/05/2026 - Pediatra',
    },
  ],
  unidades: [
    {
      id: 1,
      nome: 'UBS Vila Mariana',
      tipo: 'UBS',
      endereco: 'R. Domingos de Morais, 2187',
      distancia: '0,8 km',
      tempoEspera: 25,
      horario: '7h às 19h',
      telefone: '(11) 5549-1234',
    },
    {
      id: 2,
      nome: 'UPA Santo Amaro',
      tipo: 'UPA',
      endereco: 'Av. Adolfo Pinheiro, 1550',
      distancia: '2,1 km',
      tempoEspera: 45,
      horario: '24 horas',
      telefone: '(11) 5521-5678',
    },
    {
      id: 3,
      nome: 'Hospital São Paulo',
      tipo: 'Hospital',
      endereco: 'R. Napoleão de Barros, 715',
      distancia: '3,5 km',
      tempoEspera: 90,
      horario: '24 horas',
      telefone: '(11) 5576-4000',
    },
    {
      id: 4,
      nome: 'UBS Saúde Jabaquara',
      tipo: 'UBS',
      endereco: 'R. Eng. George Corbisier, 322',
      distancia: '1,5 km',
      tempoEspera: 35,
      horario: '7h às 17h',
      telefone: '(11) 5011-2233',
    },
    {
      id: 5,
      nome: 'UPA Campo Limpo',
      tipo: 'UPA',
      endereco: 'Estrada do Campo Limpo, 3455',
      distancia: '5,2 km',
      tempoEspera: 30,
      horario: '24 horas',
      telefone: '(11) 5841-9900',
    },
    {
      id: 6,
      nome: 'AMA Vila Mariana',
      tipo: 'AMA',
      endereco: 'R. Pereira da Silva, 25',
      distancia: '0,4 km',
      tempoEspera: 20,
      horario: '7h às 19h',
      telefone: '(11) 5549-4400',
    },
    {
      id: 7,
      nome: 'AMA Jabaquara',
      tipo: 'AMA',
      endereco: 'Av. Jabaquara, 820',
      distancia: '1,2 km',
      tempoEspera: 15,
      horario: '7h às 19h',
      telefone: '(11) 5061-8800',
    },
  ],
  laudoExemplo: {
    original: `RECEITUÁRIO MÉDICO
    
Paciente: Maria da Silva Santos
Data: 05/03/2026

1) Losartana Potássica 50mg
   - 1cp VO 1x/dia em jejum
   
2) Hidroclorotiazida 25mg
   - 1cp VO pela manhã
   
3) Sinvastatina 20mg
   - 1cp VO à noite

Retorno em 90 dias com exames:
- Hemograma completo
- Glicemia de jejum
- Perfil lipídico
- Creatinina sérica

Dr. Carlos Eduardo Mendes
CRM-SP 123456`,
    traduzido: [
      {
        remedio: 'Losartana Potássica 50mg',
        explicacao: 'Remédio para pressão alta. Tomar 1 comprimido por dia, de manhã, antes de comer. Não pare de tomar sem falar com seu médico.',
      },
      {
        remedio: 'Hidroclorotiazida 25mg',
        explicacao: 'Remédio que ajuda a baixar a pressão e diminuir o inchaço. Tomar 1 comprimido de manhã. Pode dar mais vontade de fazer xixi.',
      },
      {
        remedio: 'Sinvastatina 20mg',
        explicacao: 'Remédio para baixar o colesterol (gordura no sangue). Tomar 1 comprimido à noite, antes de dormir.',
      },
    ],
    examesExplicados: 'Seu médico pediu exames de sangue para ver como tá sua saúde geral: açúcar no sangue, gorduras e se os rins tão funcionando bem. Você precisa voltar em 3 meses com os resultados.',
  },
  passosAgendamento: [
    {
      titulo: 'Abra o Meu SUS Digital',
      descricao: 'Entre no site meususdigital.saude.gov.br ou abra o aplicativo no celular.',
      dica: 'Se não tiver o app, pode baixar de graça na lojinha do celular.',
    },
    {
      titulo: 'Faça login com sua conta Gov.br',
      descricao: 'Use seu CPF e senha do Gov.br. Se não tiver, clique em "Criar conta".',
      dica: 'Anote sua senha num lugar seguro!',
    },
    {
      titulo: 'Clique em "Agendamentos"',
      descricao: 'Na tela principal, procure o botão "Agenda" ou "Agendamentos".',
      dica: 'Fica geralmente no menu principal ou embaixo da tela.',
    },
    {
      titulo: 'Escolha o tipo de consulta',
      descricao: 'Selecione se é consulta médica, exame, vacina ou outro serviço.',
      dica: 'Se não souber qual escolher, selecione "Clínico Geral".',
    },
    {
      titulo: 'Confirme dia e horário',
      descricao: 'Veja as opções de data e hora disponíveis e escolha a melhor pra você.',
      dica: 'Chegue 15 minutos antes no dia marcado!',
    },
  ],
  // ============================================================================
  // HISTÓRICO MÉDICO - Dados mockados para MVP
  // NOTA: Em produção, esses dados virão da RNDS (Rede Nacional de Dados em Saúde)
  // URL: https://rnds.saude.gov.br - requer credenciamento como estabelecimento de saúde
  // Para integração futura: implementar OAuth Gov.br + RNDS API
  // ============================================================================
  historico_medico: {
    cartao_vacinas: [
      {
        id: 1,
        nome: 'COVID-19 (Dose 1)',
        data: '15/03/2024',
        estabelecimento: 'UBS Vila Mariana',
        status: 'tomada',
        lote: 'ABC123456',
      },
      {
        id: 2,
        nome: 'COVID-19 (Dose 2)',
        data: '12/04/2024',
        estabelecimento: 'UBS Vila Mariana',
        status: 'tomada',
        lote: 'ABC123457',
      },
      {
        id: 3,
        nome: 'Influenza (Gripe)',
        data: '01/03/2025',
        estabelecimento: 'AMA Vila Mariana',
        status: 'em_atraso',
        proxima_dose: '01/03/2026',
      },
      {
        id: 4,
        nome: 'Pneumocócica 23',
        data: 'pendente',
        status: 'pendente',
        recomendacao: 'Recomendada para maiores de 60 anos',
      },
    ],
    exames_resultados: [
      {
        id: 1,
        nome: 'Hemograma Completo',
        data: '28/02/2026',
        status: 'pronto',
        resultado: 'Normal',
        proxima_coleta: '28/05/2026',
      },
      {
        id: 2,
        nome: 'Glicemia de Jejum',
        data: '28/02/2026',
        status: 'pronto',
        resultado: 'Normal',
        valor: '95 mg/dL',
        referencia: 'até 100 mg/dL',
      },
      {
        id: 3,
        nome: 'Perfil Lipídico',
        data: '28/02/2026',
        status: 'pronto',
        resultado: 'Colesterol total elevado',
        valor: '240 mg/dL',
        referencia: 'desejável: até 200 mg/dL',
        acoes: ['Aumentar atividade física', 'Reduzir alimentos gordurosos', 'Voltar ao médico em 30 dias'],
      },
      {
        id: 4,
        nome: 'Creatinina Sérica',
        data: '28/02/2026',
        status: 'pronto',
        resultado: 'Normal',
      },
    ],
    medicamentos: [
      {
        id: 1,
        nome: 'Losartana Potássica',
        dose: '50mg',
        frequencia: '1 comprimido ao dia',
        horario: 'pela manhã em jejum',
        indicacao: 'Pressão alta',
        desde: '01/01/2023',
        avisos: ['Não interrompa sem avisar o médico', 'Pode causar tontura nos primeiros dias'],
      },
      {
        id: 2,
        nome: 'Simvastatina',
        dose: '20mg',
        frequencia: '1 comprimido ao dia',
        horario: 'à noite',
        indicacao: 'Colesterol alto',
        desde: '15/02/2024',
        avisos: ['Evite álcool em excesso'],
      },
      {
        id: 3,
        nome: 'Metformina',
        dose: '500mg',
        frequencia: '2 comprimidos ao dia',
        horario: 'nas refeições principais',
        indicacao: 'Controle de glicose',
        desde: '10/03/2025',
        avisos: ['Tomar com água', 'Pode causar gases nos primeiros dias'],
      },
    ],
    consultas_retornos: [
      {
        id: 1,
        especialidade: 'Cardiologia',
        medico: 'Dr. Carlos Eduardo Mendes',
        data_consulta: '05/03/2026',
        estabelecimento: 'UBS Vila Mariana',
        motivo: 'Acompanhamento de hipertensão',
        diagnostico: 'Hipertensão controlada',
        proxima_consulta: '15/04/2026',
      },
      {
        id: 2,
        especialidade: 'Endocrinologia',
        medico: 'Dra. Paula Oliveira',
        data_consulta: '12/02/2026',
        estabelecimento: 'UBS Saúde Jabaquara',
        motivo: 'Acompanhamento de diabetes tipo 2',
        diagnostico: 'Diabetes tipo 2 bem controlada',
        proxima_consulta: '15/05/2026',
      },
      {
        id: 3,
        especialidade: 'Clínico Geral',
        medico: 'Dr. João Silva',
        data_consulta: '28/02/2026',
        estabelecimento: 'AMA Vila Mariana',
        motivo: 'Consulta de rotina anual',
        diagnostico: 'Sem alterações significativas',
        proxima_consulta: '28/02/2027',
      },
    ],
    // Alertas baseados no perfil do usuário (regras de negócio do Ministério da Saúde)
    alertas_preventivos: [
      {
        id: 1,
        tipo: 'idade',
        condicao: 'Mulher acima de 40 anos',
        exame: 'Mamografia',
        frequencia: 'Anual a partir dos 40 anos',
        proxima_data: '15/05/2026 (em 64 dias)',
        urgencia: 'media',
        link_agendamento: true,
      },
      {
        id: 2,
        tipo: 'condicao_cronica',
        condicao: 'Hipertensão diagnosticada',
        exame: 'Aferição de Pressão',
        frequencia: 'Mensal ou conforme orientação médica',
        proxima_data: '15/04/2026 (na próxima consulta)',
        urgencia: 'baixa',
      },
      {
        id: 3,
        tipo: 'condicao_cronica',
        condicao: 'Diabetes tipo 2',
        exame: 'Hemoglobina Glicada (HbA1c)',
        frequencia: 'A cada 3 meses',
        proxima_data: '28/05/2026 (3 meses após última coleta)',
        urgencia: 'media',
      },
      {
        id: 4,
        tipo: 'condicao_cronica',
        condicao: 'Colesterol elevado',
        exame: 'Perfil Lipídico completo',
        frequencia: 'A cada 6 meses',
        proxima_data: '28/08/2026',
        urgencia: 'baixa',
      },
      {
        id: 5,
        tipo: 'condicao_cronica',
        condicao: 'Hipertensão + Diabetes',
        exame: 'Creatinina e Microalbuminúria',
        frequencia: 'Anualmente',
        proxima_data: '28/02/2027',
        urgencia: 'media',
        motivo: 'Monitorar função renal',
      },
    ],
  },
};

// ============================================================================
// HOOKS CUSTOMIZADOS
// ============================================================================

// Hook para reconhecimento de voz
function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('O microfone não tá disponível no seu aparelho');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Você precisa permitir o uso do microfone');
      } else if (event.error === 'no-speech') {
        setError('Não ouvi nada. Pode falar de novo?');
      } else {
        setError('Ops, não consegui entender. Pode repetir?');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Erro ao iniciar reconhecimento:', e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

// Hook para síntese de voz (TTS)
function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    // Cancelar fala anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // Um pouco mais lento para melhor compreensão
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, isSupported };
}

// Hook para configurações de acessibilidade
function useAccessibility() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('vidasus-fontsize');
    return saved ? parseInt(saved) : 18;
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('vidasus-highcontrast');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('vidasus-fontsize', fontSize.toString());
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('vidasus-highcontrast', highContrast.toString());
  }, [highContrast]);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 28));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 14));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  return {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
  };
}

// ============================================================================
// COMPONENTES DE UI
// ============================================================================

// Ícones SVG inline
const Icons = {
  Mic: ({ className = "w-8 h-8" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Location: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Vaccine: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Pill: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Family: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Home: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Calendar: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Back: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Plus: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Camera: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Speaker: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  Phone: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Alert: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Send: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
};

// Header com controles de acessibilidade
function Header({ 
  currentScreen, 
  onBack, 
  accessibility,
  tts 
}) {
  const { fontSize, increaseFontSize, decreaseFontSize, highContrast, toggleHighContrast } = accessibility;
  const { speak, stop, isSpeaking } = tts;

  const screenTitles = {
    home: 'VidaSUS',
    triagem: 'O que você tá sentindo?',
    unidades: 'Onde se tratar',
    laudos: 'Entender receita',
    historico: 'Seu Histórico Médico',
    familia: 'Minha família',
    agendamento: 'Agendar consulta',
  };

  return (
    <header 
      className={`sticky top-0 z-50 px-4 py-3 ${
        highContrast 
          ? 'bg-black text-white border-b-2 border-white' 
          : 'bg-green-700 text-white shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Voltar para a tela anterior"
            >
              <Icons.Back className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-xl font-bold">{screenTitles[currentScreen]}</h1>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Controles de fonte */}
          <button
            onClick={decreaseFontSize}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg font-bold"
            aria-label="Diminuir tamanho da letra"
            disabled={fontSize <= 14}
          >
            A-
          </button>
          <button
            onClick={increaseFontSize}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg font-bold"
            aria-label="Aumentar tamanho da letra"
            disabled={fontSize >= 28}
          >
            A+
          </button>
          
          {/* Alto contraste */}
          <button
            onClick={toggleHighContrast}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              highContrast ? 'bg-white text-black' : 'hover:bg-white/20'
            }`}
            aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
          >
            ◐
          </button>
          
          {/* Leitura em voz alta */}
          <button
            onClick={() => isSpeaking ? stop() : speak(screenTitles[currentScreen])}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              isSpeaking ? 'bg-yellow-400 text-black' : 'hover:bg-white/20'
            }`}
            aria-label={isSpeaking ? 'Parar leitura' : 'Ler em voz alta'}
          >
            <Icons.Speaker className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

// Navegação inferior
function BottomNav({ currentScreen, onNavigate, highContrast }) {
  const navItems = [
    { id: 'home', label: 'Início', icon: Icons.Home },
    { id: 'familia', label: 'Família', icon: Icons.Family },
    { id: 'agendamento', label: 'Agendar', icon: Icons.Calendar },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        highContrast 
          ? 'bg-black border-t-2 border-white' 
          : 'bg-white border-t border-gray-200 shadow-lg'
      }`}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center justify-center w-full h-full px-2 transition-colors ${
              currentScreen === id
                ? highContrast
                  ? 'text-yellow-400'
                  : 'text-green-700'
                : highContrast
                  ? 'text-white'
                  : 'text-gray-500'
            }`}
            aria-label={label}
            aria-current={currentScreen === id ? 'page' : undefined}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Botão grande de ação
function BigButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon: Icon,
  className = '',
  disabled = false,
  ariaLabel,
  highContrast = false,
}) {
  const baseStyles = "flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-98 disabled:opacity-50";
  
  const variants = {
    primary: highContrast 
      ? 'bg-white text-black border-2 border-white' 
      : 'bg-green-600 text-white hover:bg-green-700 shadow-md',
    secondary: highContrast
      ? 'bg-black text-white border-2 border-white'
      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md',
    outline: highContrast
      ? 'bg-black text-white border-2 border-white'
      : 'bg-white text-green-700 border-2 border-green-600 hover:bg-green-50',
    danger: highContrast
      ? 'bg-white text-black border-2 border-white'
      : 'bg-red-600 text-white hover:bg-red-700 shadow-md',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
    >
      {Icon && <Icon className="w-6 h-6" />}
      {children}
    </button>
  );
}

// Card de atalho rápido
function QuickAccessCard({ icon: Icon, label, onClick, highContrast }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all active:scale-95 min-h-[100px] ${
        highContrast
          ? 'bg-black text-white border-2 border-white'
          : 'bg-white text-gray-800 shadow-md hover:shadow-lg border border-gray-100'
      }`}
      aria-label={label}
    >
      <div className={`p-3 rounded-full mb-2 ${
        highContrast ? 'bg-white text-black' : 'bg-green-100 text-green-700'
      }`}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-sm font-semibold text-center">{label}</span>
    </button>
  );
}

// ============================================================================
// TELAS
// ============================================================================

// Tela Home
function ScreenHome({ onNavigate, voice, highContrast }) {
  const [inputText, setInputText] = useState('');
  const { isListening, transcript, error, isSupported, startListening, stopListening } = voice;

  // Determinar saudação baseada na hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Processar entrada (voz ou texto)
  const handleSubmit = (text) => {
    if (text.trim()) {
      onNavigate('triagem', { initialMessage: text.trim() });
    }
  };

  // Atualizar input quando transcrição mudar
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const quickAccessItems = [
    { icon: Icons.Location, label: 'Onde me tratar', screen: 'unidades' },
    { icon: Icons.Vaccine, label: 'Minhas vacinas', screen: 'familia' },
    { icon: Icons.Pill, label: 'Meus documentos', screen: 'laudos' },
    { icon: Icons.Calendar, label: 'Histórico médico', screen: 'historico' },
    { icon: Icons.Family, label: 'Minha família', screen: 'familia' },
  ];

  return (
    <div className={`min-h-screen pb-20 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Saudação */}
      <div className={`px-6 pt-6 pb-12 ${highContrast ? 'bg-black' : 'bg-gradient-to-b from-green-700 to-green-600'} text-white rounded-b-3xl`}>
        <p className="text-lg opacity-90">{getGreeting()},</p>
        <h2 className="text-2xl font-bold">{MOCK_DATA.usuario.nome}! 👋</h2>
        <p className="mt-2 opacity-80">Como posso te ajudar hoje?</p>
      </div>

      {/* Área principal de entrada */}
      <div className="px-4 -mt-6">
        <div className={`rounded-3xl p-6 ${
          highContrast ? 'bg-black border-2 border-white' : 'bg-white shadow-xl'
        }`}>
          {/* Botão de microfone */}
          <div className="flex flex-col items-center mb-4">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!isSupported}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500 animate-pulse scale-110'
                  : highContrast
                    ? 'bg-white text-black'
                    : 'bg-green-600 hover:bg-green-700'
              } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''} text-white shadow-lg`}
              aria-label={isListening ? 'Parar de ouvir' : 'Falar com VidaSUS'}
            >
              <Icons.Mic className="w-12 h-12" />
            </button>
            <p className={`mt-3 font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>
              {isListening ? '🎤 Estou ouvindo...' : 'Falar com VidaSUS'}
            </p>
            {error && (
              <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
            )}
          </div>

          {/* Divisor */}
          <div className="flex items-center gap-4 my-4">
            <div className={`flex-1 h-px ${highContrast ? 'bg-white' : 'bg-gray-200'}`}></div>
            <span className={`text-sm ${highContrast ? 'text-white' : 'text-gray-400'}`}>ou digite</span>
            <div className={`flex-1 h-px ${highContrast ? 'bg-white' : 'bg-gray-200'}`}></div>
          </div>

          {/* Campo de texto */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(inputText)}
              placeholder="Ex: Tô com dor de cabeça..."
              className={`flex-1 px-4 py-3 rounded-xl text-base ${
                highContrast
                  ? 'bg-black text-white border-2 border-white placeholder-gray-400'
                  : 'bg-gray-100 text-gray-800 border border-gray-200 placeholder-gray-500'
              }`}
              aria-label="Digite o que você está sentindo"
            />
            <button
              onClick={() => handleSubmit(inputText)}
              disabled={!inputText.trim()}
              className={`p-3 rounded-xl transition-colors ${
                inputText.trim()
                  ? highContrast
                    ? 'bg-white text-black'
                    : 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              aria-label="Enviar mensagem"
            >
              <Icons.Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Atalhos rápidos */}
      <div className="px-4 mt-6">
        <h3 className={`text-lg font-bold mb-3 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
          Atalhos rápidos
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickAccessItems.map((item) => (
            <QuickAccessCard
              key={item.screen}
              icon={item.icon}
              label={item.label}
              onClick={() => onNavigate(item.screen)}
              highContrast={highContrast}
            />
          ))}
        </div>
      </div>

      {/* Card promocional */}
      <div className="px-4 mt-6">
        <div className={`rounded-2xl p-4 ${
          highContrast ? 'bg-black border-2 border-yellow-400' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm ${highContrast ? 'text-yellow-400' : 'text-blue-800'}`}>
            💡 <strong>Dica:</strong> Você pode agendar consultas direto pelo Meu SUS Digital. 
            <button 
              onClick={() => onNavigate('agendamento')}
              className={`underline ml-1 font-semibold ${highContrast ? 'text-yellow-400' : 'text-blue-700'}`}
            >
              Veja como →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MOTOR DE ANÁLISE DE TRIAGEM
// ============================================================================
function analisarSintomas(sintomas, intensidadeTexto, outrosSintomas) {
  const s = sintomas.toLowerCase();
  const o = outrosSintomas.toLowerCase();

  // Extrair número de intensidade (1–10)
  const numMatch = intensidadeTexto.match(/\b([1-9]|10)\b/);
  const intensidade = numMatch ? parseInt(numMatch[1]) : 5;

  // Palavras de alarme nos outros sintomas
  const alarме = /(pescoço duro|pescoço rígido|não consigo mover|febre alta|40 graus|convuls|desmaio|paralisia|não sinto|sem sentir|vista embac|visão dupla|falta de ar|dificuld.*respir|aperto no peito|dor no peito)/i;
  const alarmePresente = alarме.test(o) || alarме.test(s);

  // Keywords de urgência imediata nos sintomas iniciais
  const emergencia = /(dor no peito|falta de ar|não consigo respira|aperto no coração|desmaiei|desmaio|convulsão|paralisia|avc|derrame)/i;

  if (emergencia.test(s)) {
    return {
      nivel: 'emergencia',
      recomendacao: 'Emergência',
      cor: 'red',
      emoji: '🚨',
      explicacao: `O que você descreveu pode ser sério e precisa de atendimento imediato. Não espere — ligue agora pro SAMU (192) ou peça pra alguém te levar à Emergência mais próxima.`,
      acoes: [
        { label: 'Ligar pro SAMU agora (192)', action: 'samu', icon: Icons.Phone, variant: 'danger' },
        { label: 'Ver emergências próximas', action: 'unidades', filtro: 'Hospital', icon: Icons.Location, variant: 'outline' },
      ],
    };
  }

  if (alarmePresente || intensidade >= 8) {
    return {
      nivel: 'upa',
      recomendacao: 'UPA',
      cor: 'orange',
      emoji: '⚠️',
      explicacao: `Com a intensidade que você relatou${alarmePresente ? ' e os outros sinais' : ''}, o melhor é ir à UPA. Lá têm médicos e equipamentos pra te avaliar direitinho, sem precisar de agendamento.`,
      acoes: [
        { label: 'Encontrar UPA perto', action: 'unidades', filtro: 'UPA', icon: Icons.Location, variant: 'primary' },
        { label: 'Ligar pro SAMU (192)', action: 'samu', icon: Icons.Phone, variant: 'outline' },
      ],
    };
  }

  // Sinais que indicam UBS (podem esperar agendamento)
  const cronico = /(sempre|faz tempo|crônico|cronica|todo dia|toda semana|meses|anos)/i;
  const leve = /(fraco|fraca|pouco|pouquinho|leve|passando|passou quase)/i;

  const telemedicina = intensidade <= 2 || leve.test(s);
  const ubs = intensidade <= 5 && !alarmePresente;

  if (telemedicina && !cronico.test(s)) {
    return {
      nivel: 'telemedicina',
      recomendacao: 'Telemedicina',
      cor: 'blue',
      emoji: '💻',
      explicacao: `O que você tá sentindo parece leve por agora. Uma boa opção é uma consulta por telemedicina — você fala com um médico pelo celular ou computador, sem sair de casa. Se piorar, aí vai pra UBS ou UPA.`,
      acoes: [
        { label: 'Agendar pelo Meu SUS Digital', action: 'agendamento', icon: Icons.Calendar, variant: 'primary' },
        { label: 'Encontrar UBS perto', action: 'unidades', filtro: 'UBS', icon: Icons.Location, variant: 'outline' },
      ],
    };
  }

  if (ubs) {
    return {
      nivel: 'ubs',
      recomendacao: 'UBS',
      cor: 'green',
      emoji: '🏥',
      explicacao: `O que você tá sentindo pode ser avaliado na UBS do seu bairro. Lá o médico vai te examinar e indicar o tratamento certo. Se possível, ligue antes pra ver o horário de atendimento.`,
      acoes: [
        { label: 'Encontrar UBS perto', action: 'unidades', filtro: 'UBS', icon: Icons.Location, variant: 'primary' },
        { label: 'Agendar consulta', action: 'agendamento', icon: Icons.Calendar, variant: 'outline' },
      ],
    };
  }

  // Default: UPA
  return {
    nivel: 'upa',
    recomendacao: 'UPA',
    cor: 'orange',
    emoji: '⚠️',
    explicacao: `Pelo que você me contou, recomendo ir à UPA. Lá você consegue atendimento sem agendamento e têm recursos pra uma avaliação mais completa.`,
    acoes: [
      { label: 'Encontrar UPA perto', action: 'unidades', filtro: 'UPA', icon: Icons.Location, variant: 'primary' },
      { label: 'Ligar pro SAMU (192)', action: 'samu', icon: Icons.Phone, variant: 'outline' },
    ],
  };
}

// ============================================================================
// CONSTANTES E HOOK OPENAI
// ============================================================================
const SYSTEM_PROMPT_TRIAGEM = `Você é a VidaSUS, assistente de saúde pública do SUS brasileiro.
Seu papel: orientar o usuário sobre qual serviço de saúde procurar com base no que está sentindo.

REGRAS:
- Use linguagem 100% coloquial brasileira, como conversa com familiar idoso
- PROIBIDO usar: "sintoma", "patologia", "triagem", "prescrição", "quadro clínico"
- USE: "o que você tá sentindo", "dói muito?", "tá se sentindo mal?"
- Após a 1ª mensagem do usuário, faça EXATAMENTE 2 perguntas de acompanhamento (uma por vez):
  • 1ª pergunta: intensidade da sensação de 1 a 10
  • 2ª pergunta: outros sinais associados (febre, enjoo, tontura, falta de ar, visão embaçada, etc.)
- Após receber as 2 respostas, dê a recomendação final
- Na ÚLTIMA linha da recomendação, coloque obrigatoriamente UMA dessas tags (em linha separada):
  [REC:UBS] — condição leve, agendar na UBS do bairro
  [REC:UPA] — intensidade alta (7+/10) ou sinais preocupantes, avaliação rápida sem agendamento
  [REC:EMERGENCIA] — dor no peito, falta de ar grave, convulsão, AVC, desmaio — atendimento imediato
  [REC:TELEMEDICINA] — sintomas muito leves, pode ser avaliado por vídeo sem sair de casa
- Seja empático e acolhedor, nunca assuste sem necessidade
- Respostas curtas: máximo 2-3 frases (exceto recomendação final, pode ter até 5)
- Isso é uma orientação, não um diagnóstico médico`;

const RECOMENDACAO_MAP = {
  UBS: {
    nivel: 'ubs',
    recomendacao: 'UBS',
    emoji: '🏥',
    acoes: [
      { label: 'Encontrar UBS perto', action: 'unidades', filtro: 'UBS', icon: Icons.Location, variant: 'primary' },
      { label: 'Agendar consulta', action: 'agendamento', icon: Icons.Calendar, variant: 'outline' },
    ],
  },
  UPA: {
    nivel: 'upa',
    recomendacao: 'UPA',
    emoji: '⚠️',
    acoes: [
      { label: 'Encontrar UPA perto', action: 'unidades', filtro: 'UPA', icon: Icons.Location, variant: 'primary' },
      { label: 'Ligar pro SAMU (192)', action: 'samu', icon: Icons.Phone, variant: 'outline' },
    ],
  },
  EMERGENCIA: {
    nivel: 'emergencia',
    recomendacao: 'Emergência',
    emoji: '🚨',
    acoes: [
      { label: 'Ligar pro SAMU agora (192)', action: 'samu', icon: Icons.Phone, variant: 'danger' },
      { label: 'Ver emergências próximas', action: 'unidades', filtro: 'Hospital', icon: Icons.Location, variant: 'outline' },
    ],
  },
  TELEMEDICINA: {
    nivel: 'telemedicina',
    recomendacao: 'Telemedicina',
    emoji: '💻',
    acoes: [
      { label: 'Agendar pelo Meu SUS Digital', action: 'agendamento', icon: Icons.Calendar, variant: 'primary' },
      { label: 'Encontrar UBS perto', action: 'unidades', filtro: 'UBS', icon: Icons.Location, variant: 'outline' },
    ],
  },
};

function useOpenAI() {
  const isAvailable = true;

  const chat = useCallback(async (history) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history: [{ role: 'system', content: SYSTEM_PROMPT_TRIAGEM }, ...history],
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Erro ${response.status}`);
    }
    const data = await response.json();
    return data.content;
  }, []);

  const parseRecommendation = useCallback((text) => {
    const match = text.match(/\[REC:(UBS|UPA|EMERGENCIA|TELEMEDICINA)\]/i);
    if (!match) return null;
    const tipo = match[1].toUpperCase();
    const base = RECOMENDACAO_MAP[tipo];
    if (!base) return null;
    const explicacao = text.replace(/\[REC:[^\]]+\]/gi, '').trim();
    return { ...base, explicacao };
  }, []);

  return { chat, isAvailable, parseRecommendation };
}

// Tela de Triagem por IA
function ScreenTriagem({ initialMessage = '', highContrast, voice, tts, onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [apiError, setApiError] = useState(null);

  const messagesEndRef = useRef(null);
  const conversationHistory = useRef([]);
  const initializedRef = useRef(false);
  const isSendingRef = useRef(false);
  // Fallback mock
  const currentStepRef = useRef(0);
  const userAnswers = useRef({ sintomas: '', intensidade: '', outros: '' });

  const { isListening, transcript, startListening, stopListening, isSupported } = voice;
  const { speak } = tts;
  const { chat, isAvailable: openAIAvailable, parseRecommendation } = useOpenAI();

  const mockFlow = [
    { response: 'Olá! Me conta, o que você tá sentindo? Pode falar ou digitar.' },
    { response: 'Entendi.', followUp: 'Numa escala de 1 a 10, quão forte tá essa sensação?' },
    { response: 'Anotado.', followUp: 'Você tá sentindo mais alguma coisa? Febre, enjoo, tontura, falta de ar?' },
  ];

  const addBotMessage = (text) =>
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), type: 'bot', text }]);

  // Inicializar
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const greeting = openAIAvailable
      ? 'Olá! Eu sou a VidaSUS. Me conta o que você tá sentindo — pode falar ou digitar.'
      : mockFlow[0].response;
    setMessages([{ id: 1, type: 'bot', text: greeting }]);
    conversationHistory.current = [{ role: 'assistant', content: greeting }];
    if (initialMessage) {
      const timer = setTimeout(() => handleSendRef.current(initialMessage), 700);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  const handleSend = async (text) => {
    const trimmed = (typeof text === 'string' ? text : inputText).trim();
    if (!trimmed || isSendingRef.current || showResult) return;
    isSendingRef.current = true;
    setApiError(null);

    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text: trimmed }]);
    setInputText('');

    if (openAIAvailable) {
      conversationHistory.current = [...conversationHistory.current, { role: 'user', content: trimmed }];
      setIsTyping(true);
      try {
        const response = await chat(conversationHistory.current);
        conversationHistory.current = [...conversationHistory.current, { role: 'assistant', content: response }];
        const rec = parseRecommendation(response);
        if (rec) {
          setResultData(rec);
          addBotMessage('Pronto! Com base no que você me contou, tenho uma recomendação:');
          setShowResult(true);
        } else {
          addBotMessage(response);
        }
      } catch (err) {
        console.error('OpenAI error:', err);
        setApiError('Não consegui me conectar agora. Usando modo local.');
        runMockStep(trimmed);
      } finally {
        setIsTyping(false);
      }
    } else {
      setTimeout(() => runMockStep(trimmed), 800);
    }
    isSendingRef.current = false;
  };

  const runMockStep = (trimmed) => {
    const step = currentStepRef.current;
    if (step === 0) userAnswers.current.sintomas = trimmed;
    else if (step === 1) userAnswers.current.intensidade = trimmed;
    else if (step === 2) userAnswers.current.outros = trimmed;
    const nextStep = step + 1;
    currentStepRef.current = nextStep;
    if (nextStep >= mockFlow.length) {
      const resultado = analisarSintomas(
        userAnswers.current.sintomas,
        userAnswers.current.intensidade,
        userAnswers.current.outros
      );
      setResultData(resultado);
      addBotMessage('Pronto! Com base no que você me contou, tenho uma recomendação:');
      setShowResult(true);
    } else {
      const flowStep = mockFlow[nextStep];
      addBotMessage(flowStep.response);
      if (flowStep.followUp) setTimeout(() => addBotMessage(flowStep.followUp), 900);
    }
  };

  const handleSendRef = useRef(handleSend);
  useEffect(() => { handleSendRef.current = handleSend; });

  const handleFindNearby = (filtro = 'UPA') => {
    if (!navigator.geolocation) { onNavigate('unidades', { filtro }); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => { setIsLocating(false); onNavigate('unidades', { filtro, comLocalizacao: true }); },
      () => { setIsLocating(false); onNavigate('unidades', { filtro }); },
      { timeout: 8000 }
    );
  };

  const headerColors = {
    emergencia:   highContrast ? 'bg-red-400 text-black'    : 'bg-red-600 text-white',
    upa:          highContrast ? 'bg-yellow-400 text-black'  : 'bg-orange-500 text-white',
    ubs:          highContrast ? 'bg-green-400 text-black'   : 'bg-green-600 text-white',
    telemedicina: highContrast ? 'bg-blue-400 text-black'    : 'bg-blue-600 text-white',
  };

  return (
    <div className={`min-h-screen pb-32 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>

      {/* Badge modo IA */}
      <div className={`px-4 py-2 text-xs text-center ${
        openAIAvailable
          ? highContrast ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-700 border-b border-green-200'
          : highContrast ? 'bg-gray-800 text-gray-400'   : 'bg-gray-100 text-gray-500 border-b border-gray-200'
      }`}>
        {openAIAvailable ? '🤖 Assistente com IA ativo' : '📋 Modo local (sem IA)'}
      </div>

      {/* Erro de API */}
      {apiError && (
        <div
          role="alert"
          className={`mx-4 mt-2 px-4 py-2 rounded-xl text-sm ${
            highContrast ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          }`}
        >
          ⚠️ {apiError}
        </div>
      )}

      {/* Área de mensagens — role="log" + aria-live para leitores de tela */}
      <div
        role="log"
        aria-label="Conversa com VidaSUS"
        aria-live="polite"
        aria-relevant="additions"
        className="px-4 py-4 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.type === 'user'
                  ? highContrast ? 'bg-white text-black' : 'bg-green-600 text-white'
                  : highContrast ? 'bg-gray-800 text-white border border-white' : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              {msg.type === 'bot' && (
                <span className="text-xs opacity-70 block mb-1">VidaSUS</span>
              )}
              <p className="text-base">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Indicador digitando com dots animados */}
        {isTyping && (
          <div className="flex justify-start" role="status" aria-label="VidaSUS está digitando">
            <div className={`px-4 py-3 rounded-2xl ${
              highContrast ? 'bg-gray-800 text-white border border-white' : 'bg-white text-gray-500 shadow-sm'
            }`}>
              <span className="text-xs opacity-70 block mb-2">VidaSUS</span>
              <span className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        {/* Card de resultado com aria-live assertive para leitores de tela */}
        {showResult && resultData && (
          <div
            className={`rounded-2xl overflow-hidden ${highContrast ? 'border-2 border-yellow-400' : 'shadow-lg'}`}
            role="region"
            aria-label="Recomendação de saúde"
            aria-live="assertive"
          >
            <div className={`px-4 py-3 ${headerColors[resultData.nivel] || headerColors.upa}`}>
              <p className="font-bold text-lg">
                {resultData.emoji} Recomendação: {resultData.recomendacao}
              </p>
            </div>
            <div className={`p-4 ${highContrast ? 'bg-black text-white' : 'bg-white'}`}>
              <p className="text-base mb-4">{resultData.explicacao}</p>
              <div className="space-y-2">
                {resultData.acoes.map((acao, idx) => (
                  <BigButton
                    key={idx}
                    variant={acao.variant || (idx === 0 ? 'primary' : 'outline')}
                    icon={acao.icon}
                    highContrast={highContrast}
                    disabled={isLocating && acao.action === 'unidades'}
                    onClick={() => {
                      if (acao.action === 'samu') window.location.href = 'tel:192';
                      else if (acao.action === 'unidades') handleFindNearby(acao.filtro || 'UBS');
                      else if (acao.action === 'agendamento') onNavigate('agendamento');
                    }}
                  >
                    {isLocating && acao.action === 'unidades' ? '📍 Buscando localização...' : acao.label}
                  </BigButton>
                ))}
              </div>
              <button
                onClick={() => speak(resultData.explicacao)}
                className={`mt-4 flex items-center gap-2 text-sm ${
                  highContrast ? 'text-yellow-400' : 'text-blue-600'
                }`}
                aria-label="Ouvir recomendação em voz alta"
              >
                <Icons.Speaker className="w-5 h-5" />
                Ouvir em voz alta
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Área de input fixa */}
      <div className={`fixed bottom-16 left-0 right-0 p-4 ${
        highContrast ? 'bg-black border-t-2 border-white' : 'bg-white border-t border-gray-200'
      }`}>
        <div className="flex gap-2 items-center">
          {isSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-full shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : highContrast ? 'bg-white text-black' : 'bg-green-100 text-green-700'
              }`}
              aria-label={isListening ? 'Parar gravação' : 'Gravar mensagem de voz'}
            >
              <Icons.Mic className="w-6 h-6" />
            </button>
          )}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend(inputText)}
            placeholder={isTyping ? 'VidaSUS está respondendo...' : 'Digite ou fale...'}
            disabled={isTyping || showResult}
            className={`flex-1 px-4 py-3 rounded-xl text-base ${
              highContrast
                ? 'bg-black text-white border-2 border-white disabled:opacity-50'
                : 'bg-gray-100 text-gray-800 disabled:opacity-50'
            }`}
            aria-label="Digite sua mensagem para a VidaSUS"
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || isTyping || showResult}
            className={`p-3 rounded-full shrink-0 ${
              inputText.trim() && !isTyping && !showResult
                ? highContrast ? 'bg-white text-black' : 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500'
            }`}
            aria-label="Enviar mensagem"
          >
            <Icons.Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Tela Navegador do SUS (Unidades)
function ScreenUnidades({ highContrast, screenProps = {} }) {
  const [filtro, setFiltro] = useState(screenProps.filtro || 'Todos');
  const [localizacaoAtiva, setLocalizacaoAtiva] = useState(!!screenProps.comLocalizacao);
  const filtros = ['Todos', 'UBS', 'UPA', 'AMA', 'Hospital'];

  const parseDistancia = (d) => parseFloat(d.replace(',', '.'));

  const unidadesFiltradas = MOCK_DATA.unidades
    .filter((u) => filtro === 'Todos' || u.tipo === filtro)
    .sort((a, b) => localizacaoAtiva ? parseDistancia(a.distancia) - parseDistancia(b.distancia) : 0);

  const getTempoEsperaColor = (tempo) => {
    if (tempo <= 30) return highContrast ? 'text-green-400' : 'text-green-600';
    if (tempo <= 60) return highContrast ? 'text-yellow-400' : 'text-yellow-600';
    return highContrast ? 'text-red-400' : 'text-red-600';
  };

  const getTipoBadgeColor = (tipo) => {
    const colors = {
      UBS: highContrast ? 'bg-green-400 text-black' : 'bg-green-100 text-green-800',
      UPA: highContrast ? 'bg-orange-400 text-black' : 'bg-orange-100 text-orange-800',
      Hospital: highContrast ? 'bg-blue-400 text-black' : 'bg-blue-100 text-blue-800',
      AMA: highContrast ? 'bg-purple-400 text-black' : 'bg-purple-100 text-purple-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`min-h-screen pb-20 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Mapa placeholder */}
      <div className={`h-40 flex items-center justify-center ${
        highContrast ? 'bg-gray-800' : 'bg-green-100'
      }`}>
        <div className="text-center">
          <span className="text-4xl">�</span>
          <p className={`text-sm mt-2 ${highContrast ? 'text-white' : 'text-gray-600'}`}>
            {localizacaoAtiva ? '📍 Unidades ordenadas pela mais próxima de você' : 'Toque para encontrar unidades de saúde perto de você'}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filtro === f
                  ? highContrast
                    ? 'bg-white text-black'
                    : 'bg-green-600 text-white'
                  : highContrast
                    ? 'bg-black text-white border border-white'
                    : 'bg-white text-gray-700 border border-gray-300'
              }`}
              aria-pressed={filtro === f}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de unidades */}
      <div className="px-4 space-y-3">
        {unidadesFiltradas.map((unidade) => (
          <div
            key={unidade.id}
            className={`rounded-2xl p-4 ${
              highContrast
                ? 'bg-black border-2 border-white'
                : 'bg-white shadow-sm border border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                  {unidade.nome}
                </h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getTipoBadgeColor(unidade.tipo)}`}>
                  {unidade.tipo}
                </span>
              </div>
              <span className={`text-sm font-semibold ${highContrast ? 'text-green-400' : 'text-green-600'}`}>
                {unidade.distancia}
              </span>
            </div>

            <p className={`text-sm mb-3 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              📍 {unidade.endereco}
            </p>

            <div className="flex flex-wrap gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Icons.Clock className={`w-4 h-4 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={highContrast ? 'text-white' : 'text-gray-700'}>{unidade.horario}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`font-medium ${getTempoEsperaColor(unidade.tempoEspera)}`}>
                  ~{unidade.tempoEspera} min de espera
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(unidade.endereco + ' São Paulo')}`, '_blank')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium ${
                  highContrast
                    ? 'bg-white text-black'
                    : 'bg-green-600 text-white'
                }`}
                aria-label={`Como chegar em ${unidade.nome}`}
              >
                Como chegar
              </button>
              <button
                onClick={() => window.location.href = `tel:${unidade.telefone.replace(/\D/g, '')}`}
                className={`py-2 px-4 rounded-xl text-sm font-medium ${
                  highContrast
                    ? 'border-2 border-white text-white'
                    : 'border border-green-600 text-green-700'
                }`}
                aria-label={`Ligar para ${unidade.nome}`}
              >
                <Icons.Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tela Tradutor de Laudos
function ScreenLaudos({ highContrast, tts }) {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const { speak, isSpeaking, stop } = tts;
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasUploaded(true);
    }, 2000);
  };

  const readAll = () => {
    const textoCompleto = MOCK_DATA.laudoExemplo.traduzido
      .map((item) => `${item.remedio}. ${item.explicacao}`)
      .join('. ') + '. ' + MOCK_DATA.laudoExemplo.examesExplicados;
    
    speak(textoCompleto);
  };

  if (!hasUploaded) {
    return (
      <div className={`min-h-screen pb-20 flex flex-col items-center justify-center px-6 ${
        highContrast ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="text-center max-w-sm">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            highContrast ? 'bg-gray-800' : 'bg-green-100'
          }`}>
            <Icons.Camera className={`w-12 h-12 ${highContrast ? 'text-white' : 'text-green-600'}`} />
          </div>

          <h2 className={`text-xl font-bold mb-3 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
            Entender sua receita
          </h2>
          
          <p className={`mb-6 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            Tire uma foto da receita ou laudo que você recebeu. 
            Vou explicar tudo em palavras simples!
          </p>

          {isProcessing ? (
            <div className={`py-4 px-6 rounded-2xl ${highContrast ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <p className={`font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                🔍 Lendo o documento...
              </p>
              {fileName ? (
                <p className={`text-sm mt-1 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                  {fileName}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Input câmera oculto */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
              {/* Input galeria oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              <BigButton
                icon={Icons.Camera}
                onClick={() => cameraInputRef.current?.click()}
                highContrast={highContrast}
              >
                Tirar foto
              </BigButton>
              <BigButton
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                highContrast={highContrast}
              >
                📁 Escolher da galeria
              </BigButton>
            </div>
          )}


        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Botão de leitura geral */}
      <div className="px-4 py-4">
        <button
          onClick={isSpeaking ? stop : readAll}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${
            isSpeaking
              ? 'bg-red-500 text-white'
              : highContrast
                ? 'bg-white text-black'
                : 'bg-blue-600 text-white'
          }`}
          aria-label={isSpeaking ? 'Parar leitura' : 'Ler tudo em voz alta'}
        >
          <Icons.Speaker className="w-5 h-5" />
          {isSpeaking ? 'Parar leitura' : '🔊 Ler tudo em voz alta'}
        </button>
      </div>

      {/* Medicamentos traduzidos */}
      <div className="px-4 space-y-4">
        <h3 className={`font-bold text-lg ${highContrast ? 'text-white' : 'text-gray-900'}`}>
          Seus remédios:
        </h3>

        {MOCK_DATA.laudoExemplo.traduzido.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-2xl overflow-hidden ${
              highContrast ? 'border-2 border-white' : 'shadow-sm'
            }`}
          >
            <div className={`px-4 py-2 ${highContrast ? 'bg-green-400 text-black' : 'bg-green-600 text-white'}`}>
              <p className="font-semibold">💊 {item.remedio}</p>
            </div>
            <div className={`p-4 ${highContrast ? 'bg-black text-white' : 'bg-white'}`}>
              <p className="text-base leading-relaxed">{item.explicacao}</p>
              <button
                onClick={() => speak(item.explicacao)}
                className={`mt-3 flex items-center gap-1 text-sm ${
                  highContrast ? 'text-yellow-400' : 'text-blue-600'
                }`}
                aria-label={`Ouvir explicação de ${item.remedio}`}
              >
                <Icons.Speaker className="w-4 h-4" />
                Ouvir
              </button>
            </div>
          </div>
        ))}

        {/* Exames */}
        <div className={`rounded-2xl overflow-hidden mt-6 ${
          highContrast ? 'border-2 border-white' : 'shadow-sm'
        }`}>
          <div className={`px-4 py-2 ${highContrast ? 'bg-blue-400 text-black' : 'bg-blue-600 text-white'}`}>
            <p className="font-semibold">🔬 Sobre os exames pedidos</p>
          </div>
          <div className={`p-4 ${highContrast ? 'bg-black text-white' : 'bg-white'}`}>
            <p className="text-base leading-relaxed">{MOCK_DATA.laudoExemplo.examesExplicados}</p>
          </div>
        </div>

        {/* Ver documento original */}
        <details className={`rounded-2xl overflow-hidden ${
          highContrast ? 'border border-gray-600' : 'bg-gray-100'
        }`}>
          <summary className={`px-4 py-3 cursor-pointer ${
            highContrast ? 'text-gray-400' : 'text-gray-600'
          }`}>
            📄 Ver documento original
          </summary>
          <div className={`px-4 py-3 text-sm whitespace-pre-line font-mono ${
            highContrast ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'
          }`}>
            {MOCK_DATA.laudoExemplo.original}
          </div>
        </details>

        {/* Nova foto */}
        <button
          onClick={() => setHasUploaded(false)}
          className={`w-full mt-4 py-3 rounded-xl text-sm font-medium ${
            highContrast
              ? 'border border-white text-white'
              : 'border border-gray-300 text-gray-600'
          }`}
        >
          📸 Enviar outra receita
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Tela Histórico Médico com 5 seções
// Nota: Esta tela é a integração com RNDS (Rede Nacional de Dados em Saúde)
// MVP atual usa dados mockados. Para produção, implementar:
// - OAuth flow com login Gov.br
// - Chamadas à API RNDS (https://rnds.saude.gov.br/api)
// - Caching local com localStorage para performance
// ============================================================================
function ScreenHistoricoMedico({ highContrast, tts }) {
  const [abaAtiva, setAbaAtiva] = useState('vacinas'); // vacinas | exames | medicamentos | consultas | alertas
  const { speak } = tts;

  const data = MOCK_DATA.historico_medico;
  
  // Função para determinar cor baseada em urgência/status
  const getCorStatus = (status) => {
    if (status === 'em_atraso' || status === 'media') {
      return highContrast ? 'bg-yellow-900 border-yellow-400' : 'bg-yellow-50 border-yellow-200';
    }
    if (status === 'alta') {
      return highContrast ? 'bg-red-900 border-red-400' : 'bg-red-50 border-red-200';
    }
    return highContrast ? 'bg-green-900 border-green-400' : 'bg-green-50 border-green-200';
  };

  const getTextCorStatus = (status) => {
    if (status === 'em_atraso') return highContrast ? 'text-yellow-400' : 'text-yellow-700';
    if (status === 'media') return highContrast ? 'text-yellow-400' : 'text-yellow-700';
    if (status === 'alta') return highContrast ? 'text-red-400' : 'text-red-700';
    if (status === 'urgente') return highContrast ? 'text-red-400' : 'text-red-700';
    return highContrast ? 'text-green-400' : 'text-green-700';
  };

  const abas = [
    { id: 'vacinas', label: '💉 Vacinas', count: data.cartao_vacinas.length },
    { id: 'exames', label: '🧪 Exames', count: data.exames_resultados.length },
    { id: 'medicamentos', label: '💊 Medicamentos', count: data.medicamentos.length },
    { id: 'consultas', label: '👨‍⚕️ Consultas', count: data.consultas_retornos.length },
    { id: 'alertas', label: '⚠️ Alertas', count: data.alertas_preventivos.length },
  ];

  return (
    <div className={`min-h-screen pb-20 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`px-6 pt-4 pb-4 ${highContrast ? 'bg-black text-white' : 'bg-green-600 text-white'}`}>
        <h2 className="text-2xl font-bold">Seu Histórico Médico</h2>
        <p className="text-sm opacity-90 mt-1">Vacinas, exames, medicamentos e consultas em um mesmo lugar</p>
      </div>

      {/* Abas */}
      <div className={`sticky top-0 z-10 overflow-x-auto ${highContrast ? 'bg-gray-900 border-b-2 border-white' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex gap-1 px-2 py-2 min-w-max">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                abaAtiva === aba.id
                  ? highContrast
                    ? 'bg-green-700 text-white'
                    : 'bg-green-600 text-white'
                  : highContrast
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {aba.label}
              {aba.count > 0 && <span className="ml-2 text-xs">({aba.count})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="px-4 py-4 space-y-3">
        {/* ABA: VACINAS */}
        {abaAtiva === 'vacinas' && (
          <div className="space-y-3">
            {data.cartao_vacinas.length === 0 ? (
              <p className={`text-center py-8 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhuma vacina registrada
              </p>
            ) : (
              data.cartao_vacinas.map((vacina) => (
                <div
                  key={vacina.id}
                  className={`rounded-lg p-4 border ${
                    getCorStatus(vacina.status)
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                        {vacina.nome}
                      </h3>
                      <p className={`text-sm mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                        📅 {vacina.data}
                      </p>
                      {vacina.estabelecimento && (
                        <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                          📍 {vacina.estabelecimento}
                        </p>
                      )}
                      {vacina.lote && (
                        <p className={`text-xs mt-1 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                          Lote: {vacina.lote}
                        </p>
                      )}
                      {vacina.recomendacao && (
                        <p className={`text-xs mt-1 italic ${highContrast ? 'text-yellow-400' : 'text-yellow-700'}`}>
                          💡 {vacina.recomendacao}
                        </p>
                      )}
                      {vacina.proxima_dose && (
                        <p className={`text-xs mt-1 font-medium ${highContrast ? 'text-blue-400' : 'text-blue-700'}`}>
                          📍 Próxima dose: {vacina.proxima_dose}
                        </p>
                      )}
                    </div>
                    <div className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getTextCorStatus(vacina.status)}`}>
                      {vacina.status === 'tomada' && '✓ Tomada'}
                      {vacina.status === 'em_atraso' && '⚠️ Atraso'}
                      {vacina.status === 'pendente' && '⏳ Pendente'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA: EXAMES E RESULTADOS */}
        {abaAtiva === 'exames' && (
          <div className="space-y-3">
            {data.exames_resultados.length === 0 ? (
              <p className={`text-center py-8 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhum exame registrado
              </p>
            ) : (
              data.exames_resultados.map((exame) => (
                <div
                  key={exame.id}
                  className={`rounded-lg p-4 border ${
                    exame.resultado === 'Normal' ? 
                      (highContrast ? 'bg-green-900 border-green-400' : 'bg-green-50 border-green-200') :
                      (highContrast ? 'bg-yellow-900 border-yellow-400' : 'bg-yellow-50 border-yellow-200')
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                        {exame.nome}
                      </h3>
                      <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                        📅 {exame.data}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      exame.status === 'pronto' ? 
                        (highContrast ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800') :
                        (highContrast ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800')
                    }`}>
                      {exame.status === 'pronto' ? '✓ Pronto' : '⏳ Processando'}
                    </div>
                  </div>
                  
                  <div className={`rounded p-3 my-2 ${highContrast ? 'bg-black bg-opacity-30' : 'bg-white bg-opacity-50'}`}>
                    <p className={`font-bold ${highContrast ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {exame.resultado}
                    </p>
                    {exame.valor && (
                      <p className={`text-sm mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                        Valor: <span className="font-mono">{exame.valor}</span>
                      </p>
                    )}
                    {exame.referencia && (
                      <p className={`text-xs mt-1 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                        Referência: {exame.referencia}
                      </p>
                    )}
                  </div>

                  {exame.acoes && exame.acoes.length > 0 && (
                    <div className={`rounded p-3 ${highContrast ? 'bg-red-900 bg-opacity-30 border-l-2 border-red-400' : 'bg-orange-50 border-l-2 border-orange-400'}`}>
                      <p className={`text-sm font-bold mb-1 ${highContrast ? 'text-orange-300' : 'text-orange-700'}`}>
                        📋 Ações recomendadas:
                      </p>
                      <ul className={`text-sm space-y-1 ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                        {exame.acoes.map((acao, idx) => (
                          <li key={idx}>• {acao}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exame.proxima_coleta && (
                    <p className={`text-xs mt-2 font-medium ${highContrast ? 'text-blue-400' : 'text-blue-700'}`}>
                      📅 Próxima coleta: {exame.proxima_coleta}
                    </p>
                  )}
                  
                  <button
                    onClick={() => speak(`${exame.nome}. Resultado: ${exame.resultado}. ${exame.referencia ? 'Referência: ' + exame.referencia : ''}`)}
                    className={`mt-2 text-sm flex items-center gap-1 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    🔊 Ouvir resultado
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA: MEDICAMENTOS */}
        {abaAtiva === 'medicamentos' && (
          <div className="space-y-3">
            {data.medicamentos.length === 0 ? (
              <p className={`text-center py-8 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhum medicamento registrado
              </p>
            ) : (
              data.medicamentos.map((med) => (
                <div
                  key={med.id}
                  className={`rounded-lg p-4 border ${highContrast ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}
                >
                  <div className="mb-2">
                    <h3 className={`font-bold text-lg ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                      {med.nome}
                    </h3>
                    <p className={`text-sm ${highContrast ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      💊 {med.dose}
                    </p>
                  </div>

                  <div className={`rounded p-3 my-3 ${highContrast ? 'bg-green-900 bg-opacity-30 border border-green-400' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`font-bold text-sm ${highContrast ? 'text-green-300' : 'text-green-700'}`}>
                      Como tomar:
                    </p>
                    <p className={`text-sm mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                      {med.frequencia}
                    </p>
                    <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                      🕐 {med.horario}
                    </p>
                  </div>

                  <p className={`text-sm mb-2 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Para tratar:</span> {med.indicacao}
                  </p>
                  <p className={`text-xs ${highContrast ? 'text-gray-500' : 'text-gray-500'}`}>
                    Usando desde {med.desde}
                  </p>

                  {med.avisos && med.avisos.length > 0 && (
                    <div className={`rounded p-3 mt-3 ${highContrast ? 'bg-red-900 bg-opacity-30 border-l-2 border-red-400' : 'bg-red-50 border-l-2 border-red-400'}`}>
                      <p className={`text-sm font-bold mb-1 ${highContrast ? 'text-red-300' : 'text-red-700'}`}>
                        ⚠️ Importante:
                      </p>
                      <ul className={`text-sm space-y-1 ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                        {med.avisos.map((aviso, idx) => (
                          <li key={idx}>• {aviso}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => speak(`${med.nome}. Dose: ${med.dose}. ${med.frequencia}. Tomar ${med.horario}.`)}
                    className={`mt-2 text-sm flex items-center gap-1 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    🔊 Ouvir instruções
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA: CONSULTAS E RETORNOS */}
        {abaAtiva === 'consultas' && (
          <div className="space-y-3">
            {data.consultas_retornos.length === 0 ? (
              <p className={`text-center py-8 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhuma consulta registrada
              </p>
            ) : (
              data.consultas_retornos.map((consulta) => (
                <div
                  key={consulta.id}
                  className={`rounded-lg p-4 border ${highContrast ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                        {consulta.especialidade}
                      </h3>
                      <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                        Dr(a). {consulta.medico}
                      </p>
                    </div>
                  </div>

                  <div className={`rounded p-3 mb-3 ${highContrast ? 'bg-blue-900 bg-opacity-30 border border-blue-400' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className={`text-sm font-bold ${highContrast ? 'text-blue-300' : 'text-blue-700'}`}>
                      📅 {consulta.data_consulta}
                    </p>
                    <p className={`text-sm mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                      📍 {consulta.estabelecimento}
                    </p>
                  </div>

                  <p className={`text-sm mb-2 ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Motivo:</span> {consulta.motivo}
                  </p>
                  <p className={`text-sm mb-2 ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Diagnóstico:</span> {consulta.diagnostico}
                  </p>

                  <div className={`rounded p-3 ${highContrast ? 'bg-green-900 bg-opacity-30 border border-green-400' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`text-sm font-bold ${highContrast ? 'text-green-300' : 'text-green-700'}`}>
                      📅 Próximo retorno
                    </p>
                    <p className={`text-sm font-medium mt-1 ${highContrast ? 'text-green-200' : 'text-green-800'}`}>
                      {consulta.proxima_consulta}
                    </p>
                  </div>

                  <button
                    onClick={() => speak(`Consulta com ${consulta.medico}. Especialidade: ${consulta.especialidade}. Data: ${consulta.data_consulta}. Diagnóstico: ${consulta.diagnostico}. Próximo retorno: ${consulta.proxima_consulta}`)}
                    className={`mt-2 text-sm flex items-center gap-1 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    🔊 Ouvir detalhes
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA: ALERTAS PREVENTIVOS */}
        {abaAtiva === 'alertas' && (
          <div className="space-y-3">
            {data.alertas_preventivos.length === 0 ? (
              <p className={`text-center py-8 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhum alerta preventivo
              </p>
            ) : (
              data.alertas_preventivos.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`rounded-lg p-4 border-2 ${getCorStatus(alerta.urgencia)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                        {alerta.exame}
                      </h3>
                      <p className={`text-sm mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                        Por: {alerta.condicao}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2 ${
                      alerta.urgencia === 'alta' ? (highContrast ? 'bg-red-900 text-red-300' : 'bg-red-200 text-red-800') :
                      alerta.urgencia === 'media' ? (highContrast ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-200 text-yellow-800') :
                      (highContrast ? 'bg-green-900 text-green-300' : 'bg-green-200 text-green-800')
                    }`}>
                      {alerta.urgencia === 'alta' && '🔴 Prioridade'}
                      {alerta.urgencia === 'media' && '🟡 Importante'}
                      {alerta.urgencia === 'baixa' && '🟢 Rotina'}
                    </div>
                  </div>

                  <div className={`rounded p-3 my-2 ${highContrast ? 'bg-black bg-opacity-30' : 'bg-white bg-opacity-50'}`}>
                    <p className={`text-sm font-medium ${highContrast ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      📋 Frequência: {alerta.frequencia}
                    </p>
                    <p className={`text-sm mt-1 font-bold ${highContrast ? 'text-green-300' : 'text-green-700'}`}>
                      📅 Próxima: {alerta.proxima_data}
                    </p>
                  </div>

                  {alerta.motivo && (
                    <p className={`text-sm mb-2 italic ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      💡 {alerta.motivo}
                    </p>
                  )}

                  {alerta.link_agendamento && (
                    <button className={`mt-2 w-full py-2 rounded-lg font-medium transition-colors ${
                      highContrast
                        ? 'bg-green-700 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}>
                      📞 Agendar {alerta.exame}
                    </button>
                  )}

                  <button
                    onClick={() => speak(`${alerta.exame}. Frequência: ${alerta.frequencia}. Próxima: ${alerta.proxima_data}.`)}
                    className={`mt-2 text-sm flex items-center gap-1 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    🔊 Ouvir alerta
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Tela Saúde da Família
function ScreenFamilia({ highContrast }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className={`min-h-screen pb-20 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Alertas pendentes */}
      {MOCK_DATA.familia.some((m) => m.alertas.length > 0) && (
        <div className={`mx-4 mt-4 rounded-2xl p-4 ${
          highContrast ? 'bg-red-900 border-2 border-red-400' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <Icons.Alert className={`w-6 h-6 shrink-0 ${highContrast ? 'text-red-400' : 'text-red-600'}`} />
            <div>
              <p className={`font-bold ${highContrast ? 'text-red-400' : 'text-red-800'}`}>
                Atenção necessária
              </p>
              {MOCK_DATA.familia.map((membro) =>
                membro.alertas.map((alerta, idx) => (
                  <p key={`${membro.id}-${idx}`} className={`text-sm mt-1 ${
                    highContrast ? 'text-red-300' : 'text-red-700'
                  }`}>
                    • {alerta} - {membro.nome}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cards da família */}
      <div className="px-4 py-4 space-y-3">
        <h3 className={`font-bold text-lg mb-2 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
          Membros da família
        </h3>

        {MOCK_DATA.familia.map((membro) => (
          <div
            key={membro.id}
            className={`rounded-2xl p-4 ${
              highContrast
                ? 'bg-black border-2 border-white'
                : 'bg-white shadow-sm border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                highContrast ? 'bg-gray-800' : 'bg-green-100'
              }`}>
                {membro.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold text-lg ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                    {membro.nome}
                  </h4>
                  {membro.alertas.length > 0 && (
                    <span className={`w-3 h-3 rounded-full ${
                      highContrast ? 'bg-red-400' : 'bg-red-500'
                    }`} aria-label="Tem pendências" />
                  )}
                </div>
                <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                  {membro.relacao} • {membro.idade} anos
                </p>
              </div>
            </div>

            {membro.proximoRetorno && (
              <div className={`mt-3 pt-3 border-t ${
                highContrast ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  📅 Próximo retorno:
                </p>
                <p className={`font-medium ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                  {membro.proximoRetorno}
                </p>
              </div>
            )}

            {membro.alertas.length > 0 && (
              <div className={`mt-3 p-3 rounded-xl ${
                highContrast ? 'bg-red-900' : 'bg-red-50'
              }`}>
                {membro.alertas.map((alerta, idx) => (
                  <p key={idx} className={`text-sm ${highContrast ? 'text-red-300' : 'text-red-700'}`}>
                    ⚠️ {alerta}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botão adicionar familiar */}
      <div className="px-4 mt-4">
        <BigButton
          variant="outline"
          icon={Icons.Plus}
          onClick={() => setShowAddModal(true)}
          highContrast={highContrast}
        >
          Adicionar familiar
        </BigButton>
      </div>

      {/* Modal simples */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-sm rounded-2xl p-6 ${
            highContrast ? 'bg-black border-2 border-white' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
              Adicionar familiar
            </h3>
            <p className={`mb-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Pra adicionar um familiar, você precisa ter o Cartão Nacional de Saúde (CNS) dele em mãos.
            </p>
            <p className={`text-sm mb-6 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
              💡 Essa função estará disponível em breve no VidaSUS!
            </p>
            <BigButton
              onClick={() => setShowAddModal(false)}
              highContrast={highContrast}
            >
              Entendi
            </BigButton>
          </div>
        </div>
      )}
    </div>
  );
}

// Tela Agendamento Assistido
function ScreenAgendamento({ highContrast }) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = MOCK_DATA.passosAgendamento.length;

  const passo = MOCK_DATA.passosAgendamento[currentStep];

  return (
    <div className={`min-h-screen pb-20 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Progress bar */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${highContrast ? 'text-white' : 'text-gray-600'}`}>
            Passo {currentStep + 1} de {totalSteps}
          </span>
          <span className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className={`h-3 rounded-full overflow-hidden ${
          highContrast ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full transition-all duration-300 ${
              highContrast ? 'bg-green-400' : 'bg-green-600'
            }`}
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Conteúdo do passo */}
      <div className="px-4">
        <div className={`rounded-2xl p-6 ${
          highContrast ? 'bg-black border-2 border-white' : 'bg-white shadow-lg'
        }`}>
          {/* Número do passo */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 ${
            highContrast ? 'bg-green-400 text-black' : 'bg-green-100 text-green-700'
          }`}>
            {currentStep + 1}
          </div>

          <h2 className={`text-xl font-bold mb-3 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
            {passo.titulo}
          </h2>

          <p className={`text-base mb-4 leading-relaxed ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
            {passo.descricao}
          </p>

          {/* Ilustração do passo */}
          <div className={`rounded-2xl p-8 mb-4 flex items-center justify-center ${
            highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-green-50'
          }`}>
            <span className="text-8xl">
              {currentStep === 0 && '📱'}
              {currentStep === 1 && '🔐'}
              {currentStep === 2 && '📅'}
              {currentStep === 3 && '🏥'}
              {currentStep === 4 && '✅'}
            </span>
          </div>

          {/* Dica */}
          <div className={`rounded-xl p-4 ${
            highContrast ? 'bg-yellow-900 border border-yellow-400' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`text-sm ${highContrast ? 'text-yellow-400' : 'text-yellow-800'}`}>
              💡 <strong>Dica:</strong> {passo.dica}
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="px-4 mt-6 space-y-3">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className={`flex-1 py-3 rounded-xl font-medium ${
                highContrast
                  ? 'border-2 border-white text-white'
                  : 'border border-gray-300 text-gray-700'
              }`}
            >
              ← Voltar
            </button>
          )}
          
          {currentStep < totalSteps - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className={`flex-1 py-3 rounded-xl font-medium ${
                highContrast
                  ? 'bg-white text-black'
                  : 'bg-green-600 text-white'
              }`}
            >
              Próximo →
            </button>
          ) : (
            <a
              href="https://meususdigital.saude.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 py-3 rounded-xl font-medium text-center ${
                highContrast
                  ? 'bg-green-400 text-black'
                  : 'bg-green-600 text-white'
              }`}
            >
              🚀 Abrir Meu SUS Digital
            </a>
          )}
        </div>

        {currentStep === totalSteps - 1 && (
          <p className={`text-center text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
            Você será levado para o site oficial do governo
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function VidaSUS() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenProps, setScreenProps] = useState({});
  
  // Hooks
  const accessibility = useAccessibility();
  const voice = useVoiceRecognition();
  const tts = useTextToSpeech();

  const { highContrast } = accessibility;

  // Navegação
  const navigate = (screen, props = {}) => {
    setCurrentScreen(screen);
    setScreenProps(props);
  };

  const goBack = () => {
    setCurrentScreen('home');
    setScreenProps({});
  };

  // Renderizar tela atual
  const renderScreen = () => {
    const commonProps = {
      highContrast,
      onNavigate: navigate,
      voice,
      tts,
    };

    switch (currentScreen) {
      case 'home':
        return <ScreenHome {...commonProps} />;
      case 'triagem':
        return <ScreenTriagem {...commonProps} initialMessage={screenProps.initialMessage} />;
      case 'unidades':
        return <ScreenUnidades {...commonProps} screenProps={screenProps} />;
      case 'laudos':
        return <ScreenLaudos {...commonProps} />;
      case 'historico':
        return <ScreenHistoricoMedico {...commonProps} />;
      case 'familia':
        return <ScreenFamilia {...commonProps} />;
      case 'agendamento':
        return <ScreenAgendamento {...commonProps} />;
      default:
        return <ScreenHome {...commonProps} />;
    }
  };

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header
        currentScreen={currentScreen}
        onBack={goBack}
        accessibility={accessibility}
        tts={tts}
      />
      
      <main className="pb-16" role="main">
        {renderScreen()}
      </main>
      
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={navigate}
        highContrast={highContrast}
      />
    </div>
  );
}
