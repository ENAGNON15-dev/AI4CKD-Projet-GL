const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs'); // Import de bcryptjs pour le hachage de mot de passe

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // L'email doit être unique pour chaque utilisateur
    validate: {
      isEmail: true, // Valide que le format est un email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt
  hooks: {
    // Hook Sequelize pour hacher le mot de passe avant de sauvegarder l'utilisateur
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10); // Génère un sel
        user.password = await bcrypt.hash(user.password, salt); // Hache le mot de passe
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) { // Vérifie si le mot de passe a été modifié
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Méthode d'instance pour comparer les mots de passe
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
