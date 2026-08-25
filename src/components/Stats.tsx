import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Phone, Clock, Award } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface StatProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

const AnimatedCounter = ({ value, suffix = "", inView }: { value: number; suffix?: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="text-4xl md:text-5xl font-display font-bold text-primary">
      {count}{suffix}
    </span>
  );
};

const Stat = ({ icon, value, suffix, label, delay }: StatProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center p-6"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <AnimatedCounter value={value} suffix={suffix} inView={isInView} />
      <p className="mt-2 text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
};

const Stats = () => {
  const stats = [
    { icon: <Users className="w-8 h-8 text-primary" />, value: 500, suffix: "+", label: "Nöjda företag" },
    { icon: <Phone className="w-8 h-8 text-primary" />, value: 30, suffix: "+", label: "År i branschen" },
    { icon: <Clock className="w-8 h-8 text-primary" />, value: 24, suffix: "h", label: "Snabb support" },
    { icon: <Award className="w-8 h-8 text-primary" />, value: 100, suffix: "%", label: "Engagemang" },
  ];

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Våra <span className="text-white">siffror</span> talar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vi är stolta över vår erfarenhet och våra nöjda kunder
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Stat
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
