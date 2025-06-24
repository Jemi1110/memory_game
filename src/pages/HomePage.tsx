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
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <PageLayout>
      <div className="py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            Memory Game
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Un juego de memoria desafiante donde deberás emparejar letras con colores
            lo más rápido posible. ¡Demuestra tus habilidades y llega a la cima!
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Reglas del Juego */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-blue-600 text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Objetivo</h2>
            <p className="text-gray-600 text-center">
              Consigue <span className="font-bold text-blue-600">500 puntos</span> combinando correctamente
              las cartas de letras con sus colores correspondientes.
            </p>
          </motion.div>

          {/* Tiempo */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-yellow-600 text-2xl">⏱️</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Tiempo</h2>
            <p className="text-gray-600 text-center">
              Tienes <span className="font-bold text-yellow-600">10 segundos</span> por turno.
              ¡Responde rápido para ganar más puntos!
            </p>
          </motion.div>

          {/* Puntuación */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-green-600 text-2xl">🏆</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Puntuación</h2>
            <p className="text-gray-600 text-center">
              Gana puntos por velocidad y rachas correctas. 
              ¡Las rachas te dan bonificaciones especiales!
            </p>
          </motion.div>
        </motion.div>

        {/* Detalles del Juego */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Puntos por Velocidad */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">🏃‍♂️</span> Puntos por Velocidad
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                <span>🚀 1-4 seg = <span className="font-bold text-green-600">100 puntos</span> (Súper rápido)</span>
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                <span>🏃 5-7 seg = <span className="font-bold text-blue-600">75 puntos</span> (Muy rápido)</span>
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                <span>⚡ 8-10 seg = <span className="font-bold text-yellow-600">50 puntos</span> (Rápido)</span>
              </li>
              <li className="flex items-center text-red-500">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 text-sm">!</span>
                <span>🐌 Tiempo agotado = <span className="font-bold">-25 puntos</span></span>
              </li>
            </ul>
          </motion.div>

          {/* Bonificaciones y Penalizaciones */}
          <div className="space-y-6">
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="mr-2">✨</span> Bonificaciones
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                  <span><span className="font-medium">3 correctas seguidas</span> = <span className="font-bold text-green-600">+25 puntos</span> bonus</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-sm">5</span>
                  <span><span className="font-medium">5 correctas seguidas</span> = <span className="font-bold text-blue-600">+50 puntos</span> bonus</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2 text-sm">7</span>
                  <span><span className="font-medium">7+ correctas seguidas</span> = <span className="font-bold text-purple-600">+100 puntos</span> bonus</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="mr-2">⚠️</span> Penalizaciones
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2 text-sm">✖</span>
                  <span>Respuesta incorrecta = <span className="font-bold text-red-600">-15 puntos</span></span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2 text-sm">⏱</span>
                  <span>Tiempo agotado = <span className="font-bold text-red-600">-25 puntos</span></span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Botón de inicio */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            ¿Estás listo para el desafío?
          </h2>
          <Button 
            onClick={() => navigate("/setup")}
            size="lg"
            variant="primary"
            className="px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            ¡Empezar a Jugar!
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
}