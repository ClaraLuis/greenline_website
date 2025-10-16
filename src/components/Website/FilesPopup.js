import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../Contexthandlerscontext.js';
import { LanguageContext } from '../../LanguageContext.js';
import generalstyles from './Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
// import { useMutation } from 'react-query';
import { components } from 'react-select';
import API from '../../API/API.js';
import Inputfield from '../Inputfield.js';
import SubmitButton from '../Form.js';
import styles from './Generalfiles/CSS_GENERAL/general.module.css';

import { gql, useMutation, useQuery } from '@apollo/client';
import AddEditSecuritylayers from './Securitylayers/AddEditSecuritylayers.js';
import Cookies from 'universal-cookie';
import SelectComponent from '../SelectComponent.js';
import { BiEdit } from 'react-icons/bi';
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import axios from 'axios';
import uploaderstyles from './Generalfiles/CSS_GENERAL/Fileuploader.module.css';
import { VscFiles } from 'react-icons/vsc';
import Pagination from '../Pagination.js';

const { ValueContainer, Placeholder } = components;

const FilesPopup = (props) => {
    const { lang, langdetect } = React.useContext(LanguageContext);
    const { isAuth } = useContext(Contexthandlerscontext);
    const fileInputRef = useRef();
    const cookies = new Cookies();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isuploading, setisuploading] = useState(false);
    const [uploadtext, setuploadtext] = useState('');
    const [progressbarwidth, setprogressbarwidth] = useState('');
    const [beforeuploaderrortext, setbeforeuploaderrortext] = useState('');
    const [paginateFilesQuery, setpaginateFilesQuery] = useState([]);
    const { useQueryGQL, paginateFiles, fetchMerchants, useLazyQueryGQL } = API();
    const [filterFiles, setfilterFiles] = useState({
        isAsc: false,
        limit: 60,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const [paginateFilesLazyQuery] = useLazyQueryGQL(paginateFiles());

    const fetchfiles = async (merchantId) => {
        if (merchantId || cookies.get('merchantId') != undefined) {
            try {
                var { data } = await paginateFilesLazyQuery({
                    variables: {
                        input: {
                            isAsc: false,
                            limit: filterFiles?.limit,
                            afterCursor: filterFiles?.afterCursor,
                            beforeCursor: filterFiles?.beforeCursor,
                            merchantId: merchantId,
                        },
                    },
                });
                if (data?.paginateFiles) {
                    // alert(JSON.stringify(data?.paginateFiles));
                    setpaginateFilesQuery({ data: data });
                }
            } catch (e) {
                let errorMessage = 'An unexpected error occurred';
                if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                    errorMessage = e.graphQLErrors[0].message || errorMessage;
                } else if (e.networkError) {
                    errorMessage = e.networkError.message || errorMessage;
                } else if (e.message) {
                    errorMessage = e.message;
                }
                NotificationManager.warning(errorMessage, 'Warning!');
            }
        }
    };
    useEffect(() => {
        let filteredArr = selectedFiles.reduce((acc, current) => {
            const x = acc.find((item) => item.name === current.name);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        setValidFiles([...filteredArr]);
    }, [selectedFiles]);
    const preventDefault = (e) => {
        e.preventDefault();
    };
    const dragOver = (e) => {
        preventDefault(e);
    };
    const dragEnter = (e) => {
        preventDefault(e);
    };
    const dragLeave = (e) => {
        preventDefault(e);
    };
    const fileDrop = (e) => {
        preventDefault(e);
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    };
    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    };
    const fileInputClicked = () => {
        fileInputRef.current.click();
    };
    const handleFiles = (files) => {
        var totalfiles = files.length + validFiles.length;
        if (totalfiles <= 4) {
            for (let i = 0; i < files.length; i++) {
                if (validateFile(files[i])) {
                    setSelectedFiles((prevArray) => [...prevArray, files[i]]);
                } else {
                    files[i]['invalid'] = true;
                    setSelectedFiles((prevArray) => [...prevArray, files[i]]);
                    setErrorMessage('File type not permitted');
                    setUnsupportedFiles((prevArray) => [...prevArray, files[i]]);
                }
            }
        } else {
            setbeforeuploaderrortext('Only 4 Files Allowed At Once.');
        }
    };
    const validateFile = (file) => {
        // var globextentstionfiletype = file.type;
        // globextentstionfiletype = globextentstionfiletype.substring(0, globextentstionfiletype.indexOf('/'));

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }
        return true;
    };
    const fileSize = (size) => {
        if (size === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    };

    const removeFile = (name) => {
        const index = validFiles.findIndex((e) => e.name === name);
        const index2 = selectedFiles.findIndex((e) => e.name === name);
        const index3 = unsupportedFiles.findIndex((e) => e.name === name);
        validFiles.splice(index, 1);
        selectedFiles.splice(index2, 1);
        setValidFiles([...validFiles]);
        setSelectedFiles([...selectedFiles]);
        if (index3 !== -1) {
            unsupportedFiles.splice(index3, 1);
            setUnsupportedFiles([...unsupportedFiles]);
        }
        fileInputRef.current.value = null;
    };
    const uploadFiles = async () => {
        const vv = [...validFiles];
        const mediaappwithoutpostarr = [];

        validFiles.forEach((fileElement, index) => {
            if (fileElement.mediaapp && !fileElement.posterfile) {
                mediaappwithoutpostarr.push(index);
            }
            if (fileElement.invalid) {
                mediaappwithoutpostarr.push(index);
            }
        });

        if (mediaappwithoutpostarr.length === 0) {
            try {
                setisuploading(true);
                setbeforeuploaderrortext('');

                const token = await cookies.get('accessToken');
                const axiosheaders = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                };

                let filesUploaded = 0;
                const totalFiles = validFiles.length;
                setuploadtext(`${filesUploaded} / ${totalFiles} File(s) Uploaded...`);

                for (let i = 0; i < validFiles.length; i++) {
                    let uploadPercentage = 0;

                    const formData = new FormData();
                    formData.append('file', validFiles[i]);
                    formData.append('isPublic', true);
                    formData.append('merchantId', props?.merchantId);
                    formData.append('originalName', validFiles[i]?.name);

                    try {
                        const response = await axios.post(
                            `${process.env.REACT_APP_DEV_MODE === 'true' ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL}api/aws-bucket/file`,
                            formData,
                            {
                                headers: axiosheaders,
                                onUploadProgress: (progressEvent) => {
                                    uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                                    setprogressbarwidth(uploadPercentage);

                                    if (uploadPercentage === 100) {
                                        filesUploaded++;
                                        setuploadtext(`${filesUploaded} / ${totalFiles} File(s) Uploaded...`);

                                        if (filesUploaded === totalFiles) {
                                            setisuploading(false);
                                        }
                                    }
                                },
                            },
                        );

                        if (response.data.url) {
                            setValidFiles([]);
                            setSelectedFiles([]);
                            fetchfiles(parseInt(props?.merchantId));
                            NotificationManager.success('File uploaded successfully!', 'Success');
                        } else {
                            NotificationManager.warning(response.data.reason || 'Upload failed', 'Warning');
                        }
                    } catch (uploadError) {
                        handleTokenError(uploadError); // New token error handling
                        NotificationManager.error('Error uploading this file. Please try again.', 'Upload Error');
                    }
                }
            } catch (error) {
                console.error('Error during upload process:', error);
                NotificationManager.error('Failed to start the upload process. Please check your connection.', 'Error');
            } finally {
                setisuploading(false);
            }
        } else {
            const errorMessages = [];
            mediaappwithoutpostarr.forEach((index) => {
                const fileElement = validFiles[index];
                if (fileElement.invalid) {
                    errorMessages.push(`File ${fileElement.name} is invalid.`);
                } else if (fileElement.mediaapp && !fileElement.posterfile) {
                    errorMessages.push(`File ${fileElement.name} requires a poster file.`);
                }
            });

            setbeforeuploaderrortext(errorMessages.join(' '));
            NotificationManager.error('Some files are invalid or missing required attributes.', 'Upload Error');
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handleTokenError = (error) => {
        if (error.response?.data?.message === 'jwt malformed') {
            signOut(getAuth());
            cookies.remove('accessToken');
            cookies.remove('userInfo');
            cookies.remove('merchantId');
            window.location.reload();
            NotificationManager.warning('Invalid token. Please log in again.', 'Authentication Error');
        } else if (error.response?.data?.message === 'expired jwt token.') {
            cookies.remove('accessToken');
            cookies.remove('userInfo');
            cookies.remove('merchantId');
            NotificationManager.error('Token expired. Please log in again.', 'Authentication Error');
            // Optionally, refresh token logic can be added here
        } else {
            console.error('Upload Error:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        // alert(props?.merchantId);
        fetchfiles(parseInt(props?.merchantId));
    }, [props?.merchantId]);
    useEffect(() => {
        fetchfiles(parseInt(props?.merchantId));
    }, [filterFiles?.afterCursor, filterFiles.beforeCursor]);

    return (
        <>
            <Modal
                show={props?.openModal}
                onHide={() => {
                    props?.setopenModal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-12 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    props?.setopenModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div className="p-0 m-0 w-100">
                            {((isAuth([1]) && props?.merchantId) || !isAuth([1])) && (
                                <>
                                    {unsupportedFiles.length ? <p>Please remove all unsupported files.</p> : ''}
                                    <div className={`${uploaderstyles.drop_container}` + ' w-100 d-flex align-items-center '}>
                                        <div class="row w-100 m-0">
                                            <div onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop} onClick={fileInputClicked} class={'col-lg-12 text-center'}>
                                                <div className={`${uploaderstyles.drop_message}`}>
                                                    {!isuploading && (
                                                        <div class={'text-capitalize text-light'}>
                                                            <div class="text-center">
                                                                <MdOutlineCloudUpload style={{ fontSize: '40px' }} class="ml-auto mr-auto" />
                                                            </div>
                                                            <span>Add media</span>
                                                        </div>
                                                    )}
                                                    {isuploading && (
                                                        <div className={`${uploaderstyles.progress}` + ' w-100 '}>
                                                            <span class={`${uploaderstyles.uploadtext}`}>{uploadtext}</span>
                                                            <div className={`${uploaderstyles.progress_bar}`} style={{ width: progressbarwidth + '%' }}>
                                                                {progressbarwidth}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <input ref={fileInputRef} className={`${uploaderstyles.file_input}`} type="file" accept="image/*" multiple onChange={filesSelected} hidden />
                                            </div>
                                            {validFiles.length != 0 && (
                                                <div class="col-lg-12">
                                                    <hr class="mt-2 mb-0" />
                                                    <div class="row w-100 m-0">
                                                        <div class="col-lg-12 p-0 mt-3">
                                                            <div class="d-flex align-items-center text-light">
                                                                <div
                                                                    class={
                                                                        langdetect == 'en'
                                                                            ? `${styles.subtitle_icon}` + ' mr-1 mt-auto mb-auto '
                                                                            : `${styles.subtitle_icon}` + ' ml-1 mb-0 mt-auto mb-auto '
                                                                    }
                                                                >
                                                                    <VscFiles size={13} class={'text-light'} />
                                                                </div>
                                                                <p className={langdetect == 'en' ? ' m-0 p-0  ' : ' m-0 p-0 text-right '}>{lang.chosenfiles}:</p>
                                                            </div>
                                                        </div>
                                                        <div class="row ml-0 mr-0 mt-2 w-100 d-flex justify-content-center">
                                                            {validFiles.map((data, i) => {
                                                                var bgColor = '';
                                                                if (fileType(data.name) == 'png') {
                                                                    bgColor = '#16aaff';
                                                                } else if (fileType(data.name) == 'jpg' || fileType(data.name) == 'jpeg') {
                                                                    bgColor = '#28a745';
                                                                } else {
                                                                    bgColor = '#d92550';
                                                                }
                                                                return (
                                                                    <div class="col-lg-3" key={i}>
                                                                        {!data.invalid && (
                                                                            <div class="row m-0">
                                                                                <div class="col-lg-12 col-md-12 col-sm-12 d-flex text-center align-items-center justify-content-center">
                                                                                    <div class={`${uploaderstyles.image_preview}` + ' d-flex text-center align-items-center justify-content-center '}>
                                                                                        <img src={URL.createObjectURL(data)} />
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    class="col-lg-12 col-md-12 d-flex align-items-center justify-content-center mt-2 p-0 "
                                                                                    style={{ direction: 'ltr' }}
                                                                                >
                                                                                    <div className={`${uploaderstyles.file_type}`} style={{ height: 'fit-content', background: bgColor }}>
                                                                                        {fileType(data.name)}
                                                                                    </div>
                                                                                    <span
                                                                                        className={`${uploaderstyles.file_name}` + ' text-overflow font_13 '}
                                                                                        style={{ lineHeight: '20px', maxWidth: '80%' }}
                                                                                    >
                                                                                        {data.name}
                                                                                    </span>
                                                                                    <span className={`${uploaderstyles.file_size}` + ' font_12 '}>({fileSize(data.size)})</span>
                                                                                </div>
                                                                                <div class="col-lg-12 col-md-12 col-sm-12 d-flex text-center mt-2">
                                                                                    <div className={`${styles.btn} ${styles.btn_danger}` + ' m-auto '} onClick={() => removeFile(data.name)}>
                                                                                        {lang.delete}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {data.invalid && (
                                                                            <div class="row m-0">
                                                                                <div class="col-lg-12 col-md-12 col-sm-12 d-flex text-center align-items-center justify-content-center">
                                                                                    <div class={`${uploaderstyles.image_preview}` + ' d-flex text-center align-items-center justify-content-center '}>
                                                                                        <img src={URL.createObjectURL(data)} />
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-lg-12 col-md-12 d-flex align-items-center justify-content-center mt-2 p-0 ">
                                                                                    <div className={`${uploaderstyles.file_type}`} style={{ height: 'fit-content', background: bgColor }}>
                                                                                        {fileType(data.name)}
                                                                                    </div>
                                                                                    <span className={`${uploaderstyles.file_name}` + ' text-overflow '} style={{ lineHeight: '20px', maxWidth: '80%' }}>
                                                                                        {data.name}
                                                                                    </span>
                                                                                    <span className={`${uploaderstyles.file_size} ` + ' text-danger '}>* Not Valied File Type.</span>
                                                                                </div>
                                                                                <div class="col-lg-12 col-md-12 col-sm-12 d-flex text-center mt-2">
                                                                                    <div className={`${styles.btn} ${styles.btn_danger}` + ' m-auto '} onClick={() => removeFile(data.name)}>
                                                                                        {lang.delete}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {validFiles.length == 0 && <div className="progress-container row ml-0 mr-0 mt-3 w-100"></div>}
                                                        <div class="col-lg-12 text-center mt-3">
                                                            <p class={'text-danger font_15 mb-0 '}>{beforeuploaderrortext}</p>
                                                        </div>
                                                        {validFiles.length != 0 && !isuploading && (
                                                            <div class="col-lg-12 text-center mb-3">
                                                                <hr class="mt-2" />
                                                                <div class={'col-lg-12 text-center '}>
                                                                    <button className={`${styles.btn} ${styles.btn_primary}`} onClick={() => uploadFiles()}>
                                                                        Add media
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div class="col-lg-12 p-0 mb-3">
                                        <Pagination
                                            total={paginateFilesQuery?.data?.paginateFiles?.totalCount}
                                            beforeCursor={paginateFilesQuery?.data?.paginateFiles?.cursor?.beforeCursor}
                                            afterCursor={paginateFilesQuery?.data?.paginateFiles?.cursor?.afterCursor}
                                            filter={filterFiles}
                                            setfilter={setfilterFiles}
                                            loading={paginateFilesQuery?.loading}
                                        />
                                    </div>
                                    <div class="col-lg-12 my-3">
                                        <div class="row m-0 w-100 allcentered">
                                            {paginateFilesQuery?.data?.paginateFiles?.data?.map((item, index) => {
                                                var bgColor = '';
                                                if (fileType(item.name) == 'png') {
                                                    bgColor = '#16aaff';
                                                } else if (fileType(item.name) == 'jpg' || fileType(item.name) == 'jpeg') {
                                                    bgColor = '#28a745';
                                                } else {
                                                    bgColor = '#d92550';
                                                }
                                                return (
                                                    <div class={uploaderstyles._Grid_g2n5w_1}>
                                                        <div class={uploaderstyles.imagesContainer}>
                                                            <div
                                                                onClick={() => {
                                                                    props?.onChange(item.url);
                                                                }}
                                                                class={uploaderstyles.images}
                                                            >
                                                                <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={item.url} />
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 d-flex align-items-center justify-content-center mt-2 p-0 ">
                                                            {/* <div className={`${uploaderstyles.file_type}`} style={{ height: 'fit-content', background: bgColor }}>
                                                                {fileType(item.name)}
                                                            </div> */}
                                                            <span className={`${uploaderstyles.file_name}` + ' text-overflow '} style={{ lineHeight: '20px', maxWidth: '50%' }}>
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default FilesPopup;
