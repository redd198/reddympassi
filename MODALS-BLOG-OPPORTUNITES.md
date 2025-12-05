# Modals Blog et Opportunités - À ajouter

Ajouter ces modals juste avant `export default AdminDashboard` dans le fichier `src/components/AdminDashboard.jsx`

## Modal Blog (Article)

```jsx
      {/* Modal Blog Article */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8"
          >
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">
                {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
              </h3>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-2">Titre *</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Catégorie *</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Innovation">Innovation</option>
                  <option value="Tendances">Tendances</option>
                  <option value="Conseils">Conseils</option>
                  <option value="Actualités">Actualités</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Résumé *</label>
                <textarea
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Résumé court de l'article"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Contenu complet *</label>
                <textarea
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Contenu complet de l'article (HTML accepté)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">URL Image</label>
                  <input
                    type="text"
                    value={articleForm.image}
                    onChange={(e) => setArticleForm({...articleForm, image: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="/blog/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Temps de lecture</label>
                  <input
                    type="text"
                    value={articleForm.read_time}
                    onChange={(e) => setArticleForm({...articleForm, read_time: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="5 min"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={articleForm.published}
                  onChange={(e) => setArticleForm({...articleForm, published: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-semibold">
                  Publier immédiatement
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowBlogModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveArticle}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingArticle ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
```

## Modal Opportunité

```jsx
      {/* Modal Opportunité */}
      {showOpportuniteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8"
          >
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">
                {editingOpportunite ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
              </h3>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-2">Titre du poste *</label>
                <input
                  type="text"
                  value={opportuniteForm.title}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Développeur Full Stack"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Entreprise *</label>
                  <input
                    type="text"
                    value={opportuniteForm.company}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, company: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'entreprise"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Lieu</label>
                  <input
                    type="text"
                    value={opportuniteForm.location}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, location: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brazzaville, Congo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type de contrat *</label>
                <select
                  value={opportuniteForm.type}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Alternance">Alternance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={opportuniteForm.description}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, description: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Description complète du poste"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Compétences requises</label>
                <textarea
                  value={opportuniteForm.requirements}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, requirements: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Node.js, PostgreSQL..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Salaire</label>
                  <input
                    type="text"
                    value={opportuniteForm.salary}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, salary: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="À négocier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Lien candidature</label>
                  <input
                    type="url"
                    value={opportuniteForm.link}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, link: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published-opp"
                  checked={opportuniteForm.published}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, published: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="published-opp" className="text-sm font-semibold">
                  Publier immédiatement
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowOpportuniteModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveOpportunite}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingOpportunite ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
```

Ces modals doivent être ajoutés juste avant la ligne `export default AdminDashboard`.
