import bcrypt from 'bcrypt'
import { query, getClient } from './pool.js'

export async function seed() {
  const client = await getClient()
  try {
    await client.query('BEGIN')

    const existing = await client.query('SELECT COUNT(*) FROM nurses')
    if (Number(existing.rows[0].count) > 0) {
      console.log('[SEED] Data already exists, skipping.')
      await client.query('COMMIT')
      return
    }

    const hash = await bcrypt.hash('password123', 10)

    await client.query(`
      INSERT INTO departments (name, unit_type, location) VALUES
      ('Medical ICU', 'MICU', 'Floor 3 East'),
      ('Surgical ICU', 'SICU', 'Floor 3 West'),
      ('Cardiac ICU', 'CICU', 'Floor 4 East')
    `)

    await client.query(`
      INSERT INTO nurses (name, email, password_hash, role) VALUES
      ('Priya', 'priya@hospital.com', $1, 'nurse'),
      ('David', 'david@hospital.com', $1, 'charge_nurse'),
      ('Sarah', 'sarah@hospital.com', $1, 'nurse')
    `, [hash])

    await client.query(`
      INSERT INTO patients (id, department_id, bed_id, name, age, diagnosis, admit_date, status) VALUES
      (103, 1, 'ICU-07', 'Patient 103', 72, 'Sepsis', NOW() - INTERVAL '2 days', 'active'),
      (210, 1, 'ICU-03', 'Patient 210', 65, 'Post-CABG', NOW() - INTERVAL '1 day', 'active'),
      (118, 2, 'ICU-09', 'Patient 118', 58, 'Respiratory Failure', NOW() - INTERVAL '3 days', 'active'),
      (87,  2, 'ICU-11', 'Patient 087', 45, 'Pancreatitis', NOW() - INTERVAL '1 day', 'active'),
      (45,  3, 'ICU-05', 'Patient 045', 80, 'CHF', NOW() - INTERVAL '4 days', 'active'),
      (132, 3, 'ICU-02', 'Patient 132', 35, 'Trauma', NOW() - INTERVAL '12 hours', 'active'),
      (156, 1, 'ICU-08', 'Patient 156', 52, 'Pneumonia', NOW() - INTERVAL '1 day', 'active'),
      (189, 2, 'ICU-01', 'Patient 189', 70, 'AKI', NOW() - INTERVAL '2 days', 'active')
    `)

    const now = new Date()
    await client.query(`
      INSERT INTO vital_signs (patient_id, timestamp, hr, spo2, systolic_bp, diastolic_bp, rr, temperature) VALUES
      (103, $1, 112, 88.0, 82, 54, 28, 38.9),
      (210, $1, 134, 96.0, 100, 68, 22, 37.2),
      (118, $1, 88, 97.0, 120, 78, 16, 36.8),
      (87,  $1, 102, 95.0, 105, 70, 20, 37.5),
      (45,  $1, 95, 94.0, 118, 72, 18, 36.9),
      (132, $1, 76, 99.0, 128, 82, 14, 36.7),
      (156, $1, 108, 91.0, 110, 72, 24, 38.2),
      (189, $1, 82, 97.0, 135, 85, 16, 36.9)
    `, [now])

    await client.query(`
      INSERT INTO alerts (patient_id, type, parameter, value, threshold, timestamp, status) VALUES
      (103, 'physiological', 'spo2', 88.0, 90, $1, 'waiting'),
      (210, 'physiological', 'hr', 134, 120, $1, 'in_progress'),
      (118, 'technical', 'ecg', 0, 1, $1, 'waiting'),
      (87,  'physiological', 'bp', 105, 110, $1, 'waiting'),
      (45,  'physiological', 'hr', 95, 90, $1, 'resolved'),
      (156, 'physiological', 'spo2', 91, 92, $1, 'waiting')
    `, [now])

    await client.query(`
      INSERT INTO risk_scores (alert_id, score, confidence, priority, explanation) VALUES
      (1, 97.0, 95.0, 'high', 'Rapid oxygen decrease | BP falling | HR increasing'),
      (2, 95.0, 92.0, 'high', 'HR elevated (134 bpm) | BP trending down'),
      (3, 0, 99.0, 'info', 'Sensor Issue — ECG lead disconnected'),
      (4, 72.0, 85.0, 'medium', 'BP trending down | HR elevated'),
      (5, 45.0, 78.0, 'low', 'HR slightly elevated (95 bpm) — Stable'),
      (6, 68.0, 82.0, 'medium', 'SpO₂ decreasing (91%) | HR elevated | Temp rising')
    `)

    await client.query(`
      INSERT INTO assignments (alert_id, nurse_id, accepted_at, status) VALUES
      (2, 1, $1, 'active'),
      (5, 1, $1, 'resolved')
    `, [now])

    await client.query('COMMIT')
    console.log('[SEED] Database seeded successfully.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[SEED] Error:', err)
    throw err
  } finally {
    client.release()
  }
}
