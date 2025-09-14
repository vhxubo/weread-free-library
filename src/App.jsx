import { useRef, useState, useEffect } from "react";
import "./App.css";
import clsx from "clsx";

const PayTypeMap = {
  1048577: "付费会员可读",
  4097: "体验卡可读",
  134221825: "体验卡可读",
  4129: "免费",
};

const Header = ({ children, className }) => {
  return (
    <header
      className={clsx(
        "h-[64px] flex items-center justify-center px-6 text-[#f2d2a1]",
        className,
      )}
    >
      <div className="font-bold text-xl">免费图书馆</div>
      {children}
    </header>
  );
};

const Upload = ({ onRead, className, children }) => {
  const inputRef = useRef(null);
  const handleClick = () => {
    inputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        onRead(fileContent);
      };
      reader.onerror = (error) => {
        onRead("{}");
        console.error("Error reading file:", error);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className={className}>
      <button
        className="font-normal text-sm tracking-wide rounded-lg mx-8 bg-[#33384e] cursor-pointer text-[#e9d1af] px-8 py-2.5 w-[calc(100vw-18px)] md:w-[300px]"
        onClick={handleClick}
      >
        点击上传
      </button>
      <input
        type="file"
        ref={inputRef}
        accept=".json,.txt"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

const Select = ({ value, title, onChange, openKey, onOpen, options = [] }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(value);
  const label = options.find((item) => item.value == value)?.label;
  const [activeLabel, setActiveLabel] = useState(label);
  const selectRef = useRef(null);
  const handleSelect = (item) => {
    onChange(item.value);
    setActive(item.value);
    setActiveLabel(item.label);
    setOpen(false);
    onOpen("");
  };
  const handleToggle = () => {
    if (!open) {
      onOpen(title);
    } else {
      onOpen("");
    }
    setOpen(!open);
  };
  useEffect(() => {
    if (openKey !== title) {
      setOpen(false);
    }
  }, [openKey, title]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
        onOpen("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef, onOpen]);

  return (
    <div className="flex-1 select-none relative border-b border-b-[#3f455c] text-[13px]">
      <div
        className={clsx(
          "pb-3 text-[#978879] flex justify-center items-center",
          open && "!text-[#f2d2a1]",
        )}
        onClick={handleToggle}
      >
        <span>{activeLabel || title}</span>
        {open ? (
          <svg
            t="1757760383120"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3881"
            width="20"
            height="20"
            fill="#f2d2a1"
          >
            <path
              d="M723.882 606.333c14.414-14.01100001 14.414-36.749 0-50.793l-185.86-180.563c-14.44-14.00399999-37.851-14.004-52.262 0l-185.855 180.563c-14.441 14.043-14.441 36.781-1e-8 50.793 14.419 14.035 37.824 14.035 52.26800001 0l159.717-155.17500001 159.7 155.17500001c14.44 14.034 37.846 14.034 52.293 0v0z"
              p-id="3882"
            ></path>
          </svg>
        ) : (
          <svg
            t="1757760396722"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4028"
            width="20"
            height="20"
            fill="#978879"
          >
            <path
              d="M300.11799999999994 417.6670000000001c-14.413999999999996 14.011000000000003-14.413999999999985 36.748999999999995 2.1316282072803006e-14 50.793000000000006l185.8600000000001 180.56299999999993c14.440000000000007 14.003999999999992 37.851 14.003999999999987 52.262-1.7763568394002505e-14l185.85499999999993-180.56300000000005c14.440999999999994-14.043000000000005 14.440999999999981-36.781-2.1316282072803006e-14-50.793000000000006-14.419000000000002-14.034999999999997-37.824-14.03499999999999-52.268 1.7763568394002505e-14l-159.71699999999996 155.17500000000007-159.70000000000002-155.17499999999995c-14.440000000000003-14.033999999999995-37.846-14.033999999999988-52.293000000000006 1.7763568394002505e-14v0z"
              p-id="4029"
            ></path>
          </svg>
        )}
      </div>
      {open && (
        <div
          className="fixed top-[97px] w-screen px-5 py-3 left-0 md:flex md:flex-wrap grid grid-cols-3 gap-3 py-4 bg-[#252a45]"
          ref={selectRef}
        >
          {options.map((item) => (
            <div
              className={clsx(
                "rounded-lg text-center text-xs min-w-[100px] py-2.5 bg-[#363a53] text-[#9d8e7e]",
                active === item.value && "!bg-[#35374c] !text-[#f2d2a1]",
              )}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Book = ({ data, sn }) => {
  const handleClick = () => {
    // https://weread.qq.com/web/reader/48432660813ab6fe3g0106fd#outline?noScroll=1
    const link = `https://weread.qq.com/web/reader/${sn}#outline?noScroll=1`;
    console.log("link:", link, data);
  };
  return (
    <div
      className="px-4 py-3 h-[160px] flex gap-5 w-full overflow-hidden items-center hover:bg-[#252a45]"
      onClick={handleClick}
    >
      <img className="w-[90px] h-[130px]" src={data.cover} />
      <div className="flex flex-col justify-between gap-1 flex-1 h-full">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-[#f2d2a1]">{data.title}</div>
          <div className="text-left text-[#b09c84] text-sm">{data.author}</div>
        </div>
        <div
          title={data.intro}
          className="text-sm text-[#7d736e] line-clamp-2 text-left"
        >
          {data.intro}
        </div>
        <div className="flex justify-between">
          <div>
            <span className="font-bold text-lg text-[#f2d2a1]">
              {data.price}
            </span>
          </div>
          {/* <div className="font-bold"> */}
          {/*   {PayTypeMap[data.payType] || data.payType} */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [allBooks, setAllBooks] = useState([]);
  const [rawBooks, setRawBooks] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [query, setQuery] = useState({
    sort: "desc",
    payType: "all",
    category: "all",
  });
  const [openKey, setOpenKey] = useState("");

  const handleRead = (content) => {
    const jsonData = JSON.parse(content);
    const categorySet = new Set();
    if (jsonData.books) {
      const _books = jsonData.books.sort(
        (a, b) => b.bookInfo.centPrice - a.bookInfo.centPrice,
      );
      _books.forEach((item) => {
        categorySet.add(item.bookInfo.category.split("-")[0]);
      });

      setAllBooks(_books);
      setRawBooks(_books);
      setCategorys([
        { label: "全部", value: "all" },
        ...Array.from(categorySet).map((item) => ({
          label: item,
          value: item,
        })),
      ]);
    }
  };
  const handleSelect = (name, val) => {
    setQuery((preQuery) => {
      const _query = { ...preQuery, [name]: val };
      return _query;
    });
  };

  useEffect(() => {
    if (query.payType === "all") {
      setAllBooks(() => [...rawBooks]);
    } else {
      setAllBooks(() => {
        const _books = [...rawBooks].filter(
          (item) => item.bookInfo.payType == query.payType,
        );
        return _books;
      });
    }
    if (query.category !== "all") {
      setAllBooks((preBooks) => {
        const _books = [...preBooks].filter((item) =>
          item.bookInfo.category.includes(query.category),
        );
        return _books;
      });
    }
    if (query.sort === "asc") {
      setAllBooks((preBooks) => {
        const _books = [...preBooks].sort(
          (a, b) => a.bookInfo.centPrice - b.bookInfo.centPrice,
        );
        return _books;
      });
    } else if (query.sort === "desc") {
      setAllBooks((preBooks) => {
        const _books = [...preBooks].sort(
          (a, b) => b.bookInfo.centPrice - a.bookInfo.centPrice,
        );
        return _books;
      });
    }
  }, [rawBooks, query]);

  return (
    <div className="overflow-hidden flex flex-col h-screen">
      <div className={openKey && "!bg-[#252a45]"}>
        <Header></Header>
        <div className="flex w-full">
          <Select
            onOpen={setOpenKey}
            title="分类"
            options={categorys}
            openKey={openKey}
            value={query.category}
            onChange={(val) => handleSelect("category", val)}
          />
          <Select
            onOpen={setOpenKey}
            title="付费"
            options={[
              { label: "全部", value: "all" },
              ...Object.entries(PayTypeMap).map(([key, value]) => ({
                label: value,
                value: key,
              })),
            ]}
            openKey={openKey}
            value={query.payType}
            onChange={(val) => handleSelect("payType", val)}
          />
          <Select
            onOpen={setOpenKey}
            title="排序"
            openKey={openKey}
            value={query.sort}
            options={[
              { label: "倒序", value: "desc" },
              { label: "正序", value: "asc" },
            ]}
            onChange={(val) => handleSelect("sort", val)}
          />
        </div>
      </div>
      {rawBooks.length ? (
        <div className="flex flex-col gap-8 py-3 overflow-auto">
          <div className="flex flex-col gap-1">
            {allBooks.length ? (
              allBooks.map((book) => (
                <Book key={book.sn} data={book.bookInfo} sn={book.sn} />
              ))
            ) : (
              <div className="h-[calc(100vh-56px)] flex justify-center items-center text-[#978879]">
                暂无数据
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-56px)] flex justify-center items-center">
          <Upload onRead={handleRead}></Upload>
        </div>
      )}
    </div>
  );
}

export default App;
