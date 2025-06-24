import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import PageLayout from "../components/layout/PageLayout";

export default function HomePage() {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const featureCardVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <PageLayout className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Memory Game Challenge
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Pon a prueba tu memoria y velocidad en este emocionante juego de emparejamiento. 
              ¡Demuestra que tienes lo necesario para alcanzar la máxima puntuación!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                onClick={() => navigate('/game')} 
                variant="primary"
                className="px-8 py-3 text-lg font-semibold shadow-lg transform transition-all hover:scale-105"
              >
                Jugar Ahora
              </Button>
              <Button 
                onClick={() => navigate('/juego2')}
                variant="primary"
                className="px-8 py-3 text-lg font-semibold shadow-lg transform transition-all hover:scale-105"
              >
                Play Mini Juego
              </Button>
              <Button 
                onClick={() => {
                  const element = document.getElementById('como-jugar');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline"
                className="px-8 py-3 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Cómo Jugar
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Objetivo */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            variants={itemVariants}
            whileHover={featureCardVariants.hover}
          >
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Objetivo</h2>
            <p className="text-gray-600 text-center leading-relaxed">
              Consigue <span className="font-bold text-blue-600">500 puntos</span> combinando correctamente las cartas de colores y letras.
            </p>
          </motion.div>

          {/* Tiempo */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            variants={itemVariants}
            whileHover={featureCardVariants.hover}
          >
            <div className="bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⏱️</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Tiempo Límite</h2>
            <p className="text-gray-600 text-center leading-relaxed">
              Gana <span className="font-bold text-green-600">100 puntos</span> por cada acierto consecutivo. ¡Las rachas multiplican tu puntuación!
            </p>
          </motion.div>

          {/* Puntuación */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            variants={itemVariants}
            whileHover={featureCardVariants.hover}
          >
            <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🏆</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Puntuación</h2>
            <p className="text-gray-600 text-center leading-relaxed">
              Gana <span className="font-bold text-green-600">100 puntos</span> por cada acierto consecutivo. ¡Las rachas multiplican tu puntuación!
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Cómo Jugar Section */}
      <div id="como-jugar" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
              Cómo Jugar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aprende las reglas básicas y domina el juego en minutos.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                number: '1',
                title: 'Inicia una Partida',
                description: 'Comienza un nuevo juego seleccionando "Jugar Ahora" e ingresa los nombres de los jugadores.',
                icon: '🚀'
              },
              {
                number: '2',
                title: 'Responde Rápido',
                description: 'Tienes 15 segundos para decidir si la letra y el color coinciden. ¡Sé rápido y preciso!',
                icon: '⚡'
              },
              {
                number: '3',
                title: 'Acumula Puntos',
                description: 'Gana puntos por cada respuesta correcta. Las rachas de aciertos otorgan bonificaciones adicionales.',
                icon: '🏅'
              },
              {
                number: '4',
                title: 'Llega a la Meta',
                description: 'El primer jugador en alcanzar 500 puntos gana la partida. ¡Demuestra quién tiene la mejor memoria!',
                icon: '🎯'
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 pl-11">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para el desafío?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Únete a cientos de jugadores que ya están mejorando su memoria y velocidad de reacción.
            </p>
            <Button 
              onClick={() => navigate('/game')} 
              variant="primary"
              className="px-8 py-3 text-lg font-semibold shadow-lg transform transition-all hover:scale-105"
            >
              Comenzar a Jugar
            </Button>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}