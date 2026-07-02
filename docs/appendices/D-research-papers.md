# Appendix D — Research Papers

*Key papers informing the AI design and product strategy.*

## 1. "Systematic Review of Physiologic Monitor Alarm Characteristics"
**Paine et al., Critical Care Medicine, 2016**

**Key findings:**
- 72-99% of alarms have low positive predictive value
- Alarm frequency ranges from 187-771 alarms per bed per day
- Physiological alarms account for the majority, but technical alarms contribute disproportionately to false alerts

**Relevance:** Primary evidence for the problem statement and the need for sensor validation.

## 2. "Video Analysis of Factors Associated With Response Time to Physiologic Monitor Alarms"
**Bonafide et al., Critical Care Medicine, 2015**

**Key findings:**
- Median response time to alarms: 10-30 minutes
- Factors reducing response time: higher alarm volume, closer proximity, audible alarms
- Nurses prioritize based on patient risk, not alarm urgency (since alarms don't convey urgency)

**Relevance:** Supports the need for prioritized alert display and escalation automation.

## 3. "Monitor Alarm Fatigue: An Integrative Review"
**Cvach, Biomedical Instrumentation & Technology, 2012**

**Key findings:**
- Nurses develop coping strategies: silencing, disabling, ignoring alarms
- Alarm fatigue leads to delayed response to critical events
- Multi-faceted interventions (education, technology, process) are most effective

**Relevance:** Framework for understanding coping strategies and designing effective interventions.

## 4. "The Harm of Alarm Fatigue"
**Winters et al., Critical Care Medicine, 2018**

**Key findings:**
- Direct patient harm from alarm fatigue is underreported
- False alarms are not harmless — they consume cognitive resources and delay care
- Solutions must address both alarm volume and alarm relevance

**Relevance:** Ethical and clinical justification for the project.

## 5. "A Deep Learning Approach to False Alarm Detection in ICU"
**Studies using MIMIC-III dataset**

**Key findings:**
- Deep learning models can detect false alarms with >90% accuracy
- Combining multiple vital signs improves detection over single-parameter analysis
- Model confidence scores enable selective alert filtering

**Relevance:** Technical inspiration for the AI sensor validation module.

---

[← Back to Document Index](../README.md)
