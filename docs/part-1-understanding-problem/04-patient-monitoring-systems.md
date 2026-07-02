# Chapter 4 — Patient Monitoring Systems

## 4.1 ECG (Electrocardiogram)

Continuous ECG monitoring tracks heart rate and rhythm. Alarms trigger for:
- Tachycardia / Bradycardia (rate thresholds)
- Arrhythmias (atrial fibrillation, ventricular tachycardia, asystole)
- ST segment changes (potential ischemia)

**False alarm sources:** Patient movement, electrode displacement, electrical interference.

## 4.2 SpO₂ (Oxygen Saturation)

Pulse oximetry measures blood oxygen saturation. Alarms trigger when saturation falls below a threshold (typically <90%).

**False alarm sources:** Poor probe placement, patient movement, low perfusion, ambient light interference. SpO₂ is among the most common false alarm sources.

## 4.3 Blood Pressure (NIBP / IBP)

Non-invasive blood pressure (NIBP) uses an oscillometric cuff. Invasive blood pressure (IBP) uses an arterial line for continuous measurement.

**False alarm sources:** Cuff position, movement during measurement, arterial line damping, air bubbles.

## 4.4 Respiratory Rate

Impedance-based respiratory rate monitoring uses ECG electrodes to measure chest wall movement.

**False alarm sources:** Patient movement, shallow breathing, loose leads. Respiratory rate alarms have one of the lowest positive predictive values.

## 4.5 Temperature

Continuous or intermittent temperature monitoring via probe or adhesive patch.

**False alarm sources:** Probe displacement, patient drinking (oral), environmental factors.

## 4.6 Ventilator

Mechanical ventilation generates alarms for:
- High/low pressure
- High/low minute volume
- Apnea
- FiO₂ (oxygen concentration) deviation

Ventilator alarms are often more clinically meaningful but contribute significantly to overall alarm burden.

## 4.7 Infusion Pump

Pumps alarm for:
- Occlusion (blocked line)
- Air in line
- Low battery
- Infusion complete / near-empty

Pump alarms are frequent and often occur simultaneously across multiple patients at medication change times.

## 4.8 Central Monitoring Station

A central station aggregates data from all bedside monitors in the unit. It displays multiple patient waveforms and vital signs on a single screen, with alarms relayed from individual monitors.

**Limitation:** The central station does not filter or prioritize — it simply mirrors what each bedside monitor reports. The charge nurse monitoring the central station faces the same alert overload as bedside nurses.

## 4.9 EHR Integration

Some hospitals integrate monitoring data into the EHR (e.g., Epic, Cerner). This enables trend visualization and documentation but does not solve the real-time alert overload problem, as EHR systems are not designed for sub-second alarm triage.

---

[← Back to Document Index](../README.md)
