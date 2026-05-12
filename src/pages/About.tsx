export default function About() {
    const membres = [
        "KAZADI NGUDIA GRACIA",
        "KATUKU LENGA ANGÉLIQUE",
        "MIKEMPE ISANTWENE PRINCESSE",
        "MULAJA MILEMB JOSMY",
        "MATONDO YUNGI JONATHAN"
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-5xl mx-auto">

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-blue-400 mb-4">
                        À propos du projet
                    </h1>

                    <p className="text-slate-300 leading-8 text-lg">
                        Cette plateforme a été développée dans le cadre du cours
                        de Sécurité Informatique en Master 1 Informatique à
                        l’Université de Kinshasa.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-6">
                        Sujet du projet
                    </h2>

                    <p className="text-slate-300 text-lg">
                        Plateforme de gestion de clés cryptographiques (KMS)
                        avec audit ELK.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-6">
                        Membres du groupe
                    </h2>

                    <div className="space-y-4">
                        {membres.map((membre, index) => (
                            <div
                                key={index}
                                className="bg-slate-800 rounded-xl px-5 py-4 text-slate-200"
                            >
                                {membre}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-6">
                        Technologies utilisées
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                        <div>• React + TypeScript</div>
                        <div>• Node.js + Express</div>
                        <div>• MySQL</div>
                        <div>• JWT & bcrypt</div>
                        <div>• Audit ELK</div>
                        <div>• Tailwind CSS</div>
                    </div>
                </div>

            </div>
        </div>
    );
}