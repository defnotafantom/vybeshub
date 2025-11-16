// src/components/InfoSection.jsx
import React from "react";

const InfoSection = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl p-6 bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/40">
        <h1 className="text-3xl font-bold mb-4">Info sul progetto</h1>
        <p className="text-gray-700 mb-3">
          Nel mio paese (<strong>Italia</strong>), l'arte è molto sottovalutata e svalutata, mettendo spesso artisti di ogni tipo nella condizione di rinunciare alla propria passione o di dover arrancare nella vita.
        </p>
        <p className="text-gray-700 mb-3">
          L'arte non ha il giusto riconoscimento, soprattutto dal punto di vista economico. Questa piattaforma vuole dare agli artisti un <strong>palcoscenico</strong> per raccontare se stessi e la propria arte, senza distinzioni di forma artistica.
        </p>
        <p className="text-gray-700 mb-3">
          Una seconda fazione, chiamata <strong>Spacers / Recruiters</strong>, mette a disposizione un palcoscenico per la forma d'arte ricercata (es: concerti, spettacoli di danza, rassegne di moda, ecc.), indicandone criteri e capitale disponibile.
        </p>
        <p className="text-gray-700 mb-3">
          Gli artisti devono semplicemente dare il meglio nella propria espressione, pubblicare contenuti e sponsorizzarsi, aumentando punti reputazione e distintivi. Possono gestire anche il proprio "prezzo" da contrattare con lo Spacer.
        </p>
        <p className="text-gray-700 mb-3">
          Tutto questo serve agli artisti per guadagnare grazie alla loro arte e agli Spacers per diffondere cultura, intrattenere il pubblico e valorizzare il proprio spazio come centro culturale e di aggregazione.
        </p>
      </div>
    </div>
  );
};

export default InfoSection;
