import {
  Smartphone,
  PhoneCall,
  Users,
  Headphones,
} from "lucide-react";

const solutions = [
  {
    icon: Smartphone,
    title: "Mobiltelefoni",
    text: "Företagsabonnemang, nummer och mobila lösningar.",
  },
  {
    icon: PhoneCall,
    title: "Företagsväxel",
    text: "Smarta växellösningar som gör det enklare att vara tillgänglig.",
  },
  {
    icon: Users,
    title: "Samarbete & Teams",
    text: "Kommunikation som fungerar tillsammans med era befintliga verktyg.",
  },
  {
    icon: Headphones,
    title: "Support & service",
    text: "Personlig hjälp när ni behöver den – även efter leveransen.",
  },
];

const Solutions = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Våra lösningar
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Allt ni behöver för företagets telefoni.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Vi hjälper er att kombinera tjänster och teknik till en lösning
            som passar verksamheten.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution) => {
            const Icon = solution.icon;

            return (
              <div
                key={solution.title}
                className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-primary" />

                <h3 className="mt-6 font-semibold">
                  {solution.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {solution.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Solutions;