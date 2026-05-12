# Intégration ELK — Projet KMS Audit ELK

## 1. Objectif

L’objectif de l’intégration ELK est de centraliser, analyser et visualiser les journaux d’audit générés par la plateforme KMS.

Dans ce projet, chaque action importante est enregistrée dans la table `journaux_audit`.

Exemples d’actions :
- connexion réussie ;
- échec de connexion ;
- création d’une clé cryptographique ;
- révocation d’une clé ;
- création d’un utilisateur ;
- tentative d’accès non autorisé.


## 2. Rôle de ELK

ELK signifie :

- Elasticsearch
- Logstash
- Kibana

### Elasticsearch

Elasticsearch sert à stocker et indexer les journaux.

Dans notre cas, les logs du projet KMS sont envoyés dans un index appelé :

```text
kms-audit-logs