'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import data from '../projects.json';
import styles from './preview.module.css';

const selection = [
  { id: 'worlds-2023', title: 'Worlds / 2023–2024', kind: 'Campanhas · Key art', cover: 'worlds-2024-03.jpg', second: 'worlds-2023-01.jpg', layout: 'worlds', note: 'Capa panorâmica: os dois pôsteres aparecem inteiros. Para a versão final, vale montar uma composição horizontal com os personagens, o troféu e a arquitetura em camadas.', files: ['worlds-2024-03.jpg','worlds-2023-01.jpg','worlds-2023-02.jpg','worlds-2023-03.jpg','worlds-2024-01.jpg'] },
  { id: 'esports', title: 'Esports & Broadcast', kind: 'Conteúdo · Transmissões', cover: 'esports-13.jpg', layout: 'wide', note: 'A proporção 16:9 preserva as thumbnails. A capa precisa funcionar sem depender dos textos pequenos; esta final do CBLOL tem rostos e contraste fortes.', files: ['esports-13.jpg','esports-06.jpg','esports-04.jpg','esports-07.jpg','esports-10.jpg','esports-11.jpg'] },
  { id: 'gaming', title: 'Dentro do jogo', kind: 'Gaming · Thumbnails', cover: 'gaming-01.jpg', layout: 'wide', note: 'Esta capa usa uma leitura mais cinematográfica. Podemos comparar com a nova Cyberpunk e selecionar a que representa melhor seu acabamento atual.', files: ['gaming-01.jpg','gaming-02.jpg','gaming-05.jpg','gaming-09.jpg','gaming-10.jpg','gaming-11.jpg'] },
  { id: 'west-reis', title: 'West Reis', kind: 'Música · Media kit', cover: 'west-reis-01.jpg', layout: 'wide', note: 'O slide de abertura funciona inteiro em 16:9. Para o motion, vale separar retrato, título e textura; assim o movimento não depende de animar o slide achatado.', files: data.find(p => p.id === 'west-reis')!.images.map(i => i.src.split('/').pop()!) },
  { id: 'drew', title: 'DREW', kind: 'Música · Identidade visual', cover: 'drew-01.png', layout: 'drew', note: 'Aqui usamos apenas o início da prancha longa. A capa definitiva merece um arquivo horizontal próprio, com marca e uma aplicação. Clique para ver a prancha completa.', files: ['drew-01.png'] },
  { id: '1936', title: '1936', kind: 'Games · Universo visual', cover: '1936-01.png', second: '1936-13.png', layout: 'game', note: 'A capa combina identidade e pôster sem cortar a arte. Personagens e cenários separados permitiriam uma entrada animada curta, com profundidade.', files: ['1936-13.png','1936-01.png','1936-06.png','1936-07.png','1936-11.png','1936-12.png','1936-08.png','1936-09.png','1936-10.png'] },
];

export default function Draft() {
  const [selected, setSelected] = useState<(typeof selection)[number] | null>(null);
  return <div className={styles.page}>
    <div className={styles.reviewBar}><span>RASCUNHO 01 · CURADORIA DE 6 PROJETOS</span><a href="#notas">Ver observações das capas ↓</a></div>
    <header className={styles.header}><a href="#inicio" className={styles.name}>Jonathan Bolanle<span>Design & edição de vídeo</span></a><nav><a href="#trabalhos">Trabalhos</a><a href="#sobre">Sobre</a><a href="#contato">Contato <ArrowUpRight size={16}/></a></nav></header>
    <main>
      <section id="inicio" className={styles.hero}>
        <div className={styles.heroStage}>
          <img className={styles.heroLeft} src="/trabalhos/worlds-2023-01.jpg" alt="Pôster Worlds 2023, em azul e vermelho"/>
          <img className={styles.heroMiddle} src="/trabalhos/worlds-2024-03.jpg" alt="Key art da grande final do Worlds 2024"/>
          <img className={styles.heroRight} src="/trabalhos/gaming-02.jpg" alt="Thumbnail com integração de criador a um personagem de game"/>
          <span className={styles.frameLabel}>FRAME DE ABERTURA / MOTION A PRODUZIR</span>
        </div>
        <div className={styles.heroCaption}><h1>Design para quem<br/>move a cultura.</h1><div><p>Imagens e histórias para marcas,<br/>criadores e universos de entretenimento.</p><a href="#trabalhos">Explorar trabalhos <ArrowDown size={18}/></a></div></div>
        <div className={styles.credits}><span>EXPERIÊNCIA COM</span><span>Ilha das Lendas / Baiano</span><span>Omelete Company</span><span>Rio de Janeiro ↗ Remoto</span></div>
      </section>
      <section id="trabalhos" className={styles.works}>
        <div className={styles.sectionHeading}><h2>Trabalhos selecionados<span>06</span></h2><p>Games, música e identidade.<br/>Um recorte do meu trabalho.</p></div>
        <div className={styles.grid}>{selection.map((p,i)=><article key={p.id} className={`${styles.card} ${styles[p.layout]}`}>
          <button className={styles.cover} onClick={()=>setSelected(p)} aria-label={`Abrir ${p.title}`}>
            <img src={`/trabalhos/${p.cover}`} alt={`Capa do projeto ${p.title}`} loading="lazy"/>
            {p.second && <img src={`/trabalhos/${p.second}`} alt={`Segunda peça do projeto ${p.title}`} loading="lazy"/>}
            <span className={styles.openIcon}><ArrowUpRight size={24}/></span>
          </button>
          <div className={styles.cardInfo}><div><p>{String(i+1).padStart(2,'0')} / {p.kind}</p><h3><button onClick={()=>setSelected(p)}>{p.title}</button></h3></div><ArrowUpRight size={22}/></div>
        </article>)}</div>
      </section>
      <section id="sobre" className={styles.about}><span>POR TRÁS DAS PEÇAS</span><div><h2>Prazer, Jonathan.</h2><p>Sou designer e editor de vídeo no Rio de Janeiro. Trabalho com thumbnails, campanhas, identidades visuais e conteúdo para marcas e criadores.</p><div className={styles.links}><a href="/curriculo-pt.pdf" target="_blank" rel="noreferrer">Currículo PT ↗</a><a href="/curriculo-en.pdf" target="_blank" rel="noreferrer">Résumé EN ↗</a><a href="https://www.linkedin.com/in/johnbolanle/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div></section>
      <section id="contato" className={styles.contact}><p>TEM UM PROJETO EM MENTE?</p><a href="mailto:jotabolanle@gmail.com">Vamos conversar.<ArrowUpRight/></a><span>jotabolanle@gmail.com</span></section>
      <section id="notas" className={styles.notes}><h2>Para pensar as próximas artes</h2><p>Observações de revisão — esta seção serve apenas ao rascunho.</p><div>{selection.map(p=><details key={p.id}><summary>{p.title}</summary><p>{p.note}</p></details>)}</div></section>
    </main>
    <footer className={styles.footer}><span>Jonathan Bolanle © 2026</span><a href="#inicio">Voltar ao início ↑</a></footer>
    <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className={styles.dialog} showCloseButton={false}>{selected && <><div className={styles.dialogHeader}><div><DialogTitle>{selected.title}</DialogTitle><DialogDescription>{selected.kind} · Seleção de peças para revisão</DialogDescription></div><DialogClose aria-label="Fechar projeto" className={styles.close}><X/></DialogClose></div><div className={styles.gallery}>{selected.files.map((file,i)=><figure key={file}><img src={`/trabalhos/${file}`} alt={`${selected.title}, peça ${i+1}`} loading="lazy"/><figcaption>{String(i+1).padStart(2,'0')} / {file}</figcaption></figure>)}</div></>}</DialogContent></Dialog>
  </div>;
}
