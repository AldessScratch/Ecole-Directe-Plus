import { useRef, useEffect, useContext, useState } from "react";
import { AppContext } from "../../../App";

import HolographicDiv from "../../generic/CustomDivs/HolographicDiv";
import Button from "../../generic/UserInputs/Button";
import DropDownMenu from "../../generic/UserInputs/DropDownMenu";
import { getProxiedURL } from "../../../utils/requests";
import FileComponent from "../../generic/FileComponent";
import ContentLoader from "react-content-loader";

import "./Account.css";
import { is } from "date-fns/locale";

export default function Account({ schoolLife, fetchSchoolLife, fetchAdministrativeDocuments, sortSchoolLife, isLoggedIn, activeAccount }) {
    const { actualDisplayTheme, accountsListState, useUserData, useUserSettings } = useContext(AppContext)

    const settings = useUserSettings();

    const userData = useUserData();

    const moduletype = accountsListState[activeAccount].accountType === "E" ? "DOCUMENTS_ELEVE" : "DOCUMENTS";
    const module = (accountsListState[activeAccount].modules || []).find(module => module.code === moduletype);
    const availableYearsArray = module?.params?.AnneeArchive ? module.params.AnneeArchive.split(",") : [];
    const lastYear = availableYearsArray.length > 0 ? availableYearsArray[availableYearsArray.length - 1] : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`;
    const [startYear, endYear] = lastYear.split('-').map(Number);
    const nextYear = `${endYear}-${endYear + 1}`;
    availableYearsArray.push(nextYear);

    const profilePictureRefs = useRef([]);

    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);;

    useEffect(() => {
        document.title = "Compte • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        profilePictureRefs.current = [...profilePictureRefs.current]; // Met à jour les références

        for (let profilePictureRef of profilePictureRefs.current) {
            const imageLoaded = () => {
                profilePictureRef?.classList.add("loaded");
                profilePictureRef?.removeEventListener("load", imageLoaded);
            }
            profilePictureRef?.addEventListener("load", imageLoaded);
        }
    }, [profilePictureRefs.current]);

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (schoolLife.length < 1 || schoolLife[activeAccount] === undefined) {
                console.log("fetchSchoolLife");
                fetchSchoolLife(controller);
            } else {
                console.log("schoolLife:", schoolLife);
                sortSchoolLife(schoolLife, activeAccount);
            }
        }

        return () => {
            controller.abort();
        }
    }, [schoolLife, isLoggedIn, activeAccount]);

    const [selectedYear, setSelectedYear] = useState(settings.get("isSchoolYearEnabled") ? settings.get("schoolYear").join("-") : availableYearsArray[availableYearsArray.length - 1]);
    const [documents, setDocuments] = useState({ factures: [], notes: [], viescolaire: [], administratifs: [], entreprises: [] });

    // handle year change of dropdown
    function handleYearChange(year) {
        setSelectedYear(year);
        console.log("Selected year:", year);
    }

    // fetch documents on page load and year change
    useEffect(() => {
        setIsLoadingDocuments(true);
        if (isLoggedIn && selectedYear) {
            const controller = new AbortController();
            const fetchDocuments = async () => {
                try {
                    setIsLoadingDocuments(true);
                    let selectedYearFetch = selectedYear === availableYearsArray[availableYearsArray.length - 1] ? '' : selectedYear;
                    await fetchAdministrativeDocuments(selectedYearFetch, controller);
                    let data = userData.get("administrativeDocuments");
                    if (data) {
                        setDocuments(data);
                    } else {
                        setDocuments({ factures: [], notes: [], viescolaire: [], administratifs: [], entreprises: [] });
                    }
                    console.log("Documents fetched for year:", selectedYear, data);
                } catch (error) {
                    console.error("Error fetching documents:", error);
                } finally {
                    if (!controller.signal.aborted) {
                        setIsLoadingDocuments(false);
                    }
                }
            };
            fetchDocuments();
            return () => {
                controller.abort();
            };
        }
    }, [selectedYear, isLoggedIn]);

    return (
        <div id="account">
            <HolographicDiv borderRadius={10} intensity={.2} className="frame" id="profile">
                <h2 className="frame-heading">Profil</h2>
                <div id="student-informations">
                    <div id="profile-picture-container">
                        <img
                            ref={(el) => (profilePictureRefs.current[0] = el)}
                            className="profile-picture"
                            src={(settings.get("isStreamerModeEnabled") ? "/images/scholar-canardman.png" : ((accountsListState[activeAccount].firstName !== "Guest") ? getProxiedURL("https:" + accountsListState[activeAccount].picture) : accountsListState[activeAccount].picture))}
                            alt={"Photo de profil de " + accountsListState[activeAccount].firstName}
                        />
                    </div>
                    <address id="informations-container">
                        <span>Dernière connexion : <time dateTime={(new Date(accountsListState[activeAccount].lastConnection ?? Date.now())).toISOString()}>
                            {new Date(accountsListState[activeAccount].lastConnection ?? Date.now()).toLocaleDateString("fr-FR", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: "numeric",
                                minute: "numeric"
                            }).replace(",", " à")}
                        </time></span>
                        <span>Email : {settings.get("isStreamerModeEnabled") ? "contact@ecole-directe.plus" : accountsListState[activeAccount].email}</span>
                        {accountsListState[activeAccount].phoneNumber &&
                            <span>Num. téléphone : {settings.get("isStreamerModeEnabled") ? "00 00 00 00 00" : accountsListState[activeAccount].phoneNumber}</span>}
                    </address>
                    <Button disabled={true} id="statistics">Statistiques</Button>
                </div>
                <div className="coming-soon">
                    En cours de développement (bientôt disponible)
                </div>
            </HolographicDiv>
            <section className="frame" id="documents">
                {module?.enable ? (
                    <>
                        <div className="frame-heading-container">
                            <h2 className={`frame-heading frame-heading-documents ${availableYearsArray.length < 2 ? 'single-year' : ''}`}>Documents</h2>
                            {availableYearsArray.length > 1 ? (
                                <DropDownMenu
                                    name="year-selector"
                                    options={availableYearsArray}
                                    displayedOptions={availableYearsArray.map(year => year)}
                                    selected={selectedYear}
                                    onChange={handleYearChange}
                                    className="year-selector"
                                />
                            ) : null
                            }
                        </div>
                        <div className="documents-container">
                            {isLoadingDocuments ? (
                                <div>
                                    <div className="document-category">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                        <div style={{padding: "15px"}}>
                                        <h3 style={{paddingBottom: "10px"}}>
                                            <ContentLoader
                                            animate={settings.get("displayMode") === "quality"}
                                            speed={1}
                                            backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                            foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                            height="30"
                                            style={{ width: "30%" }}
                                        >
                                            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
                                            </ContentLoader>
                                        </h3>
                                            {Array.from({ length: Math.floor(Math.random() * 10 + 1) }, (_, index) => (
                                            <div className="file-box-loader " style={{paddingBottom: "3px"}}>
                                                <ContentLoader
                                                    animate={settings.get("displayMode") === "quality"}
                                                    speed={1}
                                                    backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                                    foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                                    height="30"
                                                    style={{ width: `${Math.floor(Math.random() * 31) + 60}%` }}
                                                >
                                                    <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
                                                </ContentLoader>
                                                <h2 className="file-date">                                <ContentLoader
                                                    animate={settings.get("displayMode") === "quality"}
                                                    speed={1}
                                                    backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                                    foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                                    height="30"
                                                    style={{ width: "100%" }}
                                                >
                                                    <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
                                                </ContentLoader></h2>
                                            </div>
                                        ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) :
                                documents?.administratifs?.length === 0 &&
                                    documents?.notes?.length === 0 &&
                                    documents?.viescolaire?.length === 0 &&
                                    documents?.entreprises?.length === 0 &&
                                    documents?.factures?.length === 0
                                    // && documents?.inscriptionsReinscriptions?.length === 0
                                    ? (
                                        <span className="no-available-documents">Aucun document disponible.</span>
                                        // TODO: add content-loader
                                    ) : (
                                        <>
                                            {/* {module.params.DocumentsInscriptionsReinscriptionsActif === "1" && documents?.inscriptionsReinscriptions?.length > 0 && (
                                            <div className="document-category">
                                                <h3>Inscriptions & Réinscriptions</h3>
                                                {documents.inscriptionsReinscriptions.map(file => (
                                                    <div className="file-box">
                                                        <FileComponent key={file.id} file={file} />
                                                        <h2 className="file-date">{file.specialParams.date}</h2>
                                                    </div>
                                                ))}
                                            </div>
                                        )} */}

                                            {module?.params?.DocumentsFactureActif === "1" && documents?.factures?.length > 0 && (
                                                <div className="document-category">
                                                    <h3>Factures</h3>
                                                    {documents.factures.map(file => (
                                                        <div className="file-box">
                                                            <FileComponent key={file.id} file={file} />
                                                            <h2 className="file-date">{file.specialParams.date}</h2>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {module?.params?.DocumentsAdministratifActif === "1" && documents?.administratifs?.length > 0 && (
                                                <div className="document-category">
                                                    <h3>Documents Administratifs</h3>
                                                    {documents.administratifs.map(file => (
                                                        <div className="file-box">
                                                            <FileComponent key={file.id} file={file} />
                                                            <h2 className="file-date">{file.specialParams.date}</h2>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {module?.params?.DocumentsNotesActif === "1" && documents?.notes?.length > 0 && (
                                                <div className="document-category">
                                                    <h3>Notes</h3>
                                                    {documents.notes.map(file => (
                                                        <div className="file-box">
                                                            <FileComponent key={file.id} file={file} />
                                                            <h2 className="file-date">{file.specialParams.date}</h2>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {module?.params?.DocumentsVSActif === "1" && documents?.viescolaire?.length > 0 && (
                                                <div className="document-category">
                                                    <h3>Vie Scolaire</h3>
                                                    {documents.viescolaire.map(file => (
                                                        <div className="file-box">
                                                            <FileComponent key={file.id} file={file} />
                                                            <h2 className="file-date">{file.specialParams.date}</h2>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {module?.params?.DocumentsEntrepriseActif === "1" && documents?.entreprises?.length > 0 && (
                                                <div className="document-category">
                                                    <h3>Documents Entreprise</h3>
                                                    {documents.entreprises.map(file => (
                                                        <div className="file-box">
                                                            <FileComponent key={file.id} file={file} />
                                                            <h2 className="file-date">{file.specialParams.date}</h2>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                        </div>
                    </>
                ) : (
                    <div className="documents-container">
                        <span className="no-available-documents">Le module de documents n'est pas accessible.</span>
                    </div>
                )}
            </section>
            <section className="frame" id="behavior">
                <h2 className="frame-heading">Comportement</h2>
                <div className="behavior-types">
                    <div className="behavior-type">
                        <span>Retards</span>
                        <span className={"count" + (!userData.get("sortedSchoolLife")?.delays.length ? " loading" : " loading")}>{userData.get("sortedSchoolLife")?.delays.length ?? <><span style={{ "--index": 0 }}>.</span><span style={{ "--index": 1 }}>.</span><span style={{ "--index": 2 }}>.</span></>}</span>
                    </div>
                    <div className="behavior-type">
                        <span>Absences</span>
                        <span className={"count" + (!userData.get("sortedSchoolLife")?.absences.length ? " loading" : " loading")}>{userData.get("sortedSchoolLife")?.absences.length ?? <><span style={{ "--index": 3 }}>.</span><span style={{ "--index": 4 }}>.</span><span style={{ "--index": 5 }}>.</span></>}</span>
                    </div>
                    <div className="behavior-type">
                        <span>Sanctions</span>
                        <span className={"count" + (!userData.get("sortedSchoolLife")?.sanctions.length ? " loading" : " loading")}>{userData.get("sortedSchoolLife")?.sanctions.length ?? <><span style={{ "--index": 6 }}>.</span><span style={{ "--index": 7 }}>.</span><span style={{ "--index": 8 }}>.</span></>}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}