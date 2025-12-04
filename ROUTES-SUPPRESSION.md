# Routes de suppression à ajouter dans server.js

Ajouter ces routes juste avant `app.listen(PORT, ...)` :

```javascript
// ============= ROUTES DE SUPPRESSION =============

// Supprimer une réservation
app.delete('/api/admin/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM reservations WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Réservation supprimée' })
  } catch (error) {
    console.error('Erreur suppression réservation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer une commande
app.delete('/api/admin/commandes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM commandes_livres WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Commande supprimée' })
  } catch (error) {
    console.error('Erreur suppression commande:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer un visiteur
app.delete('/api/admin/visitors/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM visitors WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Visiteur supprimé' })
  } catch (error) {
    console.error('Erreur suppression visiteur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer un lead
app.delete('/api/admin/leads/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM leads WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Lead supprimé' })
  } catch (error) {
    console.error('Erreur suppression lead:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})
```
