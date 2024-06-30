import React, { Component } from 'react';
import Cookies from 'universal-cookie';
export const LanguageContext = React.createContext();
export class LanguageProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: {
                en: {
                    companies: 'Companies',
                    addcompany: 'Add Company',
                    companyname: 'Company Name',
                    editcompany: 'Edit Company',
                    uploadlogo: 'Upload Logo',
                    employeecount: 'Employee count',
                    private: 'Private',
                    public: 'Public',
                    ownership: 'Ownership',
                    foundin: 'Found in',
                    ceo: 'CEO',
                    fblink: 'Facebook link',
                    linkedinlink: 'Linkedin link',
                    twitterlink: 'Twitter link',
                    websitelink: 'Website link',
                    companyemail: 'Company email',
                    companynumber: 'Company number',
                    mission: 'Mission',
                    reviews: 'Reviews',
                    addreview: 'Add review',
                    jobtitle: 'Job Title',
                    status: 'Status',
                    rejected: 'Rejected',
                    accepted: 'Accepted',
                    pending: 'Pending',
                    delete: 'Delete',
                    nostatus: 'No status',
                    show: 'Show',
                    reviewid: 'Review ID',
                    currentlyworkthere: 'Currently work there',
                    startdate: 'Started working on',
                    enddate: 'Employment ended on',
                    likes: 'Likes',
                    dislikes: 'Dislikes',
                    doesjobneedtravel: 'Job require travelling',
                    workingdays: 'Working days',
                    workinghoursstrictorflexible: 'Shift Timing',
                    gender: 'Gender',
                    companypolicy: 'Work policy at company',
                    employementtype: 'Employment type',
                    department: 'Department',
                    submittedat: 'Submitted at',
                    interviews: 'Interviews',
                    roundtips: 'Round Tips',
                    roundquestions: 'Round Questions',
                    question: 'Question',
                    answer: 'Answer',
                    wherethereresumescreen: 'Was there a resume screening before the interview',
                    howdidyougetinterview: 'Interview Source',
                    wheninterview: 'When was the interview',
                    interviewprocessduration: 'Interview process duration',
                    interviewdifficulty: 'Interview difficulty',
                    gotoffer: 'Interview result',
                    users: 'Users',
                    username: 'User Name',
                    email: 'Email',
                    signedat: 'Signed at',
                    createdat: 'Created at',
                    salaries: 'Salaries',
                    fixedsalary: 'Fixed salary',
                    variablesalary: 'Variable salary',
                    whichyearsalary: 'Which year’s salary',
                    lastincrementpercentage: 'Last increment percentage',
                    yearofincrement: 'Year of increment',
                    totalworkingexperience: 'Total work experience',
                    officelocation: 'Office location',
                    contributionid: 'Contribution ID',
                    userid: 'User ID',
                    adduser: 'Add user',
                    firstname: 'First name',
                    lastname: 'Last name',
                    password: 'Password',
                    phonenumber: 'Phone Number',
                    edit: 'Edit',
                    collectionname: 'Collection name',
                    numberofrewards: 'Number of rewards',
                    collectionid: 'Collection ID',
                    addcollection: 'Add collection',
                    rewardscollections: 'Rewards collections',
                    rewards: 'Rewards',
                    addreward: 'Add reward',
                    editreward: 'Edit reward',
                    rewardid: 'Reward ID',

                    brandlogo: 'Brand logo',
                    brandname: 'Brand name',
                    brandmaininfo: 'Brand main info',
                    description: 'Description',
                    rewardmaininfo: 'Reward main info',
                    price: 'Price',
                    percentage: 'Percentage',
                    validtill: 'Valid till',
                    cost: 'Cost',
                    steps: 'Steps to redeem',
                    termsandconditions: 'Terms & Conditions',

                    submittedphotos: 'Submitted photos',

                    reason: 'Reason',
                    updatestatus: 'update status',
                    add: 'Add',
                    active: 'Active',
                    draft: 'Draft',
                    title: 'Title',
                    priceaftersale: 'Price after sale',
                    coinsrequired: 'Coins required to redeem',
                    hassale: 'Has sale',
                    collections: 'Collections',
                    company: 'Company',
                    socialmedialink: 'Socialmedia link',
                    founder: 'Founder',
                    ownership: 'Ownership',
                    companydescription: 'Company description',
                    companybio: 'Company bio',
                    contactinfo: 'Contact info',
                    contactpersonname: 'Contact person name',
                    contactpersonnumber: 'Contact person number',
                    streetname: 'Street name',
                    buildingnumber: 'Building number',
                    apartmentnumber: 'Apartment number',
                    bio: 'Bio',
                    birthdate: 'Birth date',
                    female: 'Female',
                    male: 'Male',
                    update: 'Update',
                    companymaininfo: 'Company main info',
                    companylogo: 'Company logo',
                    refcode: 'ref_code',
                    importusers: 'Import users',
                    import: 'import',
                    tableformat: 'Table format',
                    importcompanies: 'Import companies',
                    coupon: 'Coupon',

                    industries: 'Industries',
                    addindustry: 'Add industry',
                    industryname: 'Industry name',

                    yes: 'Yes',
                    no: 'No',
                    primary: 'Primary',
                    other: 'Other',
                    type: 'Type',
                    industryid: 'Industry ID',
                    size: 'Size',
                    addcompanysize: 'Add Company size',
                    companysizeid: 'Company size ID',
                    companysizes: 'Company sizes',
                    skills: 'Skills',
                    skillname: 'Skill name',
                    addskill: 'Add skill',
                    skillid: 'Skill ID',
                    addlocation: 'Add Location',
                    locations: 'Locations',
                    location: 'Location',
                    locationid: 'Location ID',
                    companysizetype: 'Company size type',
                    companyemployeesizetype: 'Company employee size type',

                    local: 'Local',
                    biglocal: 'Big Local',
                    startup: 'Startup',
                    multinational: 'Multinational',
                    departments: 'Departments',
                    adddepartment: 'Add department',
                    departmentid: 'Department ID',
                    department: 'Department',
                    jobtitle: 'Job title',
                    job: 'Job',
                    jobs: 'Jobs',
                    addjob: 'Add job',
                    jobid: 'Job ID',
                    benefits: 'Benefits',
                    senioritylevel: 'Seniority level',
                    avaragesalary: 'Avarage salary',
                    addsalary: 'Add avarage salary',
                    avaragesalaries: 'Avarage salaries',
                    id: 'ID',
                    visible: 'Visible',
                    hidden: 'Hidden',
                    contribustioncoins: 'Contribustion Coins',
                    save: 'Save',
                    showinhome: 'Show in home',
                    hide: 'Hide',
                    showinpopularsearch: 'Show in popular search',
                    import: 'import',
                    export: 'export',
                    experience: 'Experience',
                    salary: 'Salary',
                    importskills: 'Import Skills',

                    overallrating: 'Overall Rating',
                    salaryandbenefits: 'Salary and Benefits',
                    companycultureemployeeengagement: 'Company Culture & Employee Engagement',
                    personaldevelopment: 'Personal Development',
                    careergrowth: 'Career Growth',
                    managementandleadershipcapabilities: 'Management and Leadership Capabilities',
                    worklifebalanceandoverallwellbeing: 'Work-Life Balance and Overall Wellbeing',
                    diversityandinclusion: 'Diversity & Inclusion',

                    whatarethestrengths: 'What are the strenghts',
                    whatarethedevelopmentareas: 'What are the development areas',
                    whatrecommendationswouldyougivetothemanagement: 'What recommendations would you give to the management',
                    wouldyourecommendthiscompanytoafriend: 'Would you recommend this company to a friend',
                    areyouconsideringleaving: 'Are you considering leaving',
                    organisationallevel: 'Organisational Level',
                    employmenettype: 'Employmenet type',
                    areyouconsideringreapplyingagain: 'Are you considering re-applying again?',

                    overallinterviewexperience: 'Overall interview experience',
                    employerbrandrepresentation: 'Employer brand representation',
                    interviewersquestionsandstyle: 'Interviewers questions and style',
                    lengthoftherecruitmentprocess: 'Length of the recruitment process',
                    courtesyandprofessionalismduringrecruitmentprocess: 'Courtesy and professionalism during recruitment process',
                    interviewtitle: 'Interview title',
                    reviewtitle: 'Review title',
                    interns: 'Interns',
                    addintern: 'Add interns',

                    name: 'Name',
                    importinterns: 'Import Interns',
                    cvtitle: 'CV title',
                    allcvs: 'All CVs',

                    nousers: 'No users',
                    nointerns: 'No Interns',
                    nocvs: 'No CVs',
                    noindustries: 'No Industries',
                    nocompanis: 'No Companies',
                    noindustries: 'No Industries',
                    nocompanysizes: 'No Company sizes',
                    noskills: 'No Skills',
                    nolocations: 'No Locations',
                    nodepartments: 'No Departments',
                    nojobs: 'No Jobs',
                    nocontributions: 'No Contributions',
                    nocompanies: 'No Companies',
                    noreviews: 'No Reviews',
                    nointerviews: 'No Interviews',
                    nosalaries: 'No Salaries',
                    nophotos: 'No Photos Contributed',
                    nobenefits: 'No Benefits Contributed',
                    norewards: 'No Rewards',
                    norewardcollections: 'No Reward Collections',
                    country: 'Country',
                    careersummary: 'Career summary',
                    companynamearabic: 'Company Name (ar)',
                    companydescriptionarabic: 'Company Description (ar)',
                    website: 'Website',
                    companybanner: 'Company banner',
                    updatebanner: 'Update banner',
                    suggestedcompanies: 'Suggested Companies',
                    searchcompany: 'Search Company',
                    awards: 'Awards',
                    addaward: 'Add Award',
                    awardname: 'Award Name',
                    awardlogo: 'Award Logo',
                    awardrank: 'Award Rank',
                    assigncompanies: 'Assign Companies',
                    uploadpdf: 'Upload pdf',
                },
                ar: {},
            },
            langdetect: '',
            setlang: this.setlang,
        };
    }

    setlang = (key) => {
        const cookies = new Cookies();
        cookies.set('sitelang', key, { path: '/' });
        this.setState({
            langdetect: key,
        });
        window.location.reload();
    };

    componentDidMount() {
        const cookies = new Cookies();
        var lastlangselected = cookies.get('sitelang');
        if (lastlangselected == 'en') {
            this.setState({
                langdetect: 'en',
            });
        } else if (lastlangselected == 'ar') {
            this.setState({
                langdetect: 'en',
            });
            document.body.setAttribute('dir', 'rtl');
        } else {
            this.setState({
                langdetect: 'en',
            });
            document.body.setAttribute('dir', 'rtl');
            this.setlang('en');
        }
    }

    render() {
        var setlang = this.state.setlang;
        var lang = '';

        if (this.state.langdetect == 'en') {
            lang = this.state.lang.en;
            document.body.setAttribute('dir', 'ltr');
        } else if (this.state.langdetect == 'ar') {
            lang = this.state.lang.ar;
            document.body.setAttribute('dir', 'rtl');
        } else {
            lang = this.state.lang.ar;
            document.body.setAttribute('dir', 'rtl');
        }

        var langdetect = this.state.langdetect;
        return <LanguageContext.Provider value={{ lang, setlang, langdetect }}>{this.props.children}</LanguageContext.Provider>;
    }
}

export const LanguageContextConsumer = LanguageContext.Consumer;
