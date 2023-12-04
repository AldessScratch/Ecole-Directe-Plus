
import { useState } from "react";
import PopUp from "./PopUps/PopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose }) {
    const patchNotesContent = <div>
        <hr />
        <p id="first-paragraph">
            Ecole Directe Plus est de retour ! Des changements relatifs à l'API d'Ecoledirecte ont causé de nombreux dysfonctionnements depuis le 14/11/2023. Nous nous excusons pour ce désagrément et avons fait preuve d'un maximum de réactivité pour rétablir le service au plus vite.
        </p>
        <h3 className="sub-header">Correction de bugs</h3>
        <ul>
            <li>Correction d'un bug majeur qui empêchait la connexion au compte ainsi que toute interaction avec l'API d'Ecoledirecte</li>
            <li>Correction d'un bug d'affichage sur les points forts</li>
        </ul>
        <h3 className="sub-header">Divers</h3>
        <li>Veuillez noter qu'Ecole Directe Plus est encore en cours de développement. Nous travaillons d'arrache-pied pour vous fournir la meilleure version possible du service.</li>
        <li>Vous avez un problème ou avez rencontré un bug ? Vous pouvez nous partager votre expérience dans la nouvelle page de feedback (tout type de retour est le bienvenu, nous sommes très curieux de connaître votre avis)</li>
        {/* <ul>
            v0.2.1
            <p id="first-paragraph">
                Vous vous trouvez sur la toute première version officielle d'Ecole Directe Plus. En compagnie de Canardman, nous avons ajouté autant de fonctionnalités que possibles pour que votre confort soit maximal. Découvrez-les ici à chaque mise à jour du site.
            </p>
            <h3 className="sub-header">Nouveautés</h3>
            <ul>
                <li>Calcul automatique et instantané de la moyenne générale</li>
                <li>Un système de streak permettant de mesurer votre progression au fil des trimestres</li>
                <li>La possibilité de voir toutes ses notes sur le même barème</li>
                <li>Un système de badge pour flex sur votre nombre d'étoiles obtenues en cours d'Anglais</li>
                <li>Un thème clair et sombre dessiné par et pour de véritables artistes</li>
                <li>Un calcul de vos points forts afin d'identifier les matières où vous excellez</li>
                <li>La possibilité de rester connecté de manière stable et durable</li>
                <li>Et tant d'autres petits ajustements que nous vous laissons découvrir par vous-même...</li>
            </ul>

            v0.1.5
            <li>Nouveau menu de connexion avec l'option "rester connecté"</li>
            <li>Choix du thème d'affichage : sombre / clair</li>
            <li>Page de paramètres : modifiez vos paramètres pour ajuster votre expérience comme bon vous semble</li>
            <h3 className="sub-header">Page des notes :</h3>
            <li>Système de Score de Streak pour vous pousser à toujours vous améliorer</li>
            <li>Affichage de vos points forts</li>
            <li>Affichage clair et moderne des notes, avec informations complémentaires</li>
            <li>Nouveau système de badge sur chaque note</li>
            </ul>
            <h3 className="sub-header">Correction de bugs</h3>
            <ul>
            <li>Changement des placeholders des éléments en cours de développement car créaient des confusions</li>
            <li>Amélioration de l'accessibilité au clavier</li>
            <li>Correction d'un bug affectant le système de reconnexion automatique</li>
        </ul> */}
    </div>;

    return (
        <div id="patch-notes">
            <PopUp type="info" header={"Nouvelle mise à jour ! 🎉 v" + currentEDPVersion} subHeader={"3 décembre 2023"} contentTitle={"Patch notes :"} content={patchNotesContent} onClose={onClose} />
        </div>
    )
}
